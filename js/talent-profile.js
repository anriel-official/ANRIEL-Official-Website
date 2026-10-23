/* AN:RIEL TALENT PROFILE */
const $ = id => document.getElementById(id);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function safeUrl(value) {
  if (!value) return '';
  try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : ''; } catch { return ''; }
}
function link(name, url, cls='talent-profile-social-link') {
  const href = safeUrl(url);
  return href ? `<a class="${cls}" href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(name)}</a>` : '';
}
function videoId(value) {
  const href = safeUrl(value); if (!href) return '';
  const u = new URL(href), h = u.hostname.toLowerCase().replace(/^www\./,'');
  let id = '';
  if (h === 'youtu.be') id = u.pathname.split('/')[1];
  if (['youtube.com','m.youtube.com','youtube-nocookie.com'].includes(h)) id = u.pathname === '/watch' ? u.searchParams.get('v') : /^\/(shorts|embed|live)\//.test(u.pathname) ? u.pathname.split('/')[2] : '';
  return /^[A-Za-z0-9_-]{11}$/.test(id || '') ? id : '';
}
function hexToRgba(hex, opacity) { const n = parseInt(hex.slice(1),16); return `rgba(${(n>>16)&255}, ${(n>>8)&255}, ${n&255}, ${opacity})`; }
function section(id, hasContent) { const el = $(id); if (el) el.hidden = !hasContent; }
function showError(error) {
  console.error('TALENTプロフィール取得エラー:', error);
  if ($('talentProfileLoading')) $('talentProfileLoading').hidden = true;
  if ($('talentProfileContent')) $('talentProfileContent').hidden = true;
  if ($('talentProfileError')) $('talentProfileError').hidden = false;
}
async function queryRows(table, columns, talentId) {
  const {data,error} = await supabaseClient.from(table).select(columns).eq('talent_id',talentId).order('sort_order',{ascending:true});
  if (error) throw error; return data || [];
}
async function loadTalentProfile() {
  if (!$('talentProfilePage')) return;
  const slug = new URLSearchParams(location.search).get('slug');
  if (!slug) { showError(new Error('slugが指定されていません')); return; }
  try {
    if (typeof supabaseClient === 'undefined' || !supabaseClient) throw new Error('Supabaseの初期化に失敗しました');
    const {data:t,error} = await supabaseClient.from('talents').select('*,talent_generations(name)').eq('slug',slug).eq('published',true).maybeSingle();
    if (error) throw error;
    if (!t) throw new Error('タレントが見つかりません');
    const [platforms,voices,profileValues,hashtagValues] = await Promise.all([
      queryRows('talent_platforms','platform_name,platform_url,sort_order',t.id),
      queryRows('talent_sample_voices','title,file_url,sort_order',t.id),
      (async()=>{const {data,error}=await supabaseClient.from('talent_profile_values').select('value,talent_profile_fields(label,sort_order,field_key)').eq('talent_id',t.id);if(error)throw error;return (data||[]).sort((a,b)=>(a.talent_profile_fields?.sort_order??0)-(b.talent_profile_fields?.sort_order??0));})(),
      (async()=>{const {data,error}=await supabaseClient.from('talent_hashtag_values').select('value,talent_hashtag_fields(label,sort_order)').eq('talent_id',t.id);if(error)throw error;return (data||[]).sort((a,b)=>(a.talent_hashtag_fields?.sort_order??0)-(b.talent_hashtag_fields?.sort_order??0));})()
    ]);
    const background = /^#[\da-fA-F]{6}$/.test(t.background_color || '') ? t.background_color : '#ffffff';
    $('talentProfilePage').style.setProperty('--talent-background-color',background);
    $('talentProfilePage').style.backgroundColor = hexToRgba(background, 0.48);
    document.title = `${t.name || 'TALENT'} | TALENT | AN:RIEL`;
    $('talentProfileGeneration').textContent = t.talent_generations?.name || '';
    $('talentProfileName').textContent = t.name || '';
    $('talentProfileNameEn').textContent = t.name_en || '';
    const img = $('talentProfileImage'); const imageUrl = safeUrl(t.profile_image_url);
    img.hidden = !imageUrl; if (imageUrl) {img.src=imageUrl;img.alt=t.name||'TALENT';}
    const logoUrl = safeUrl(t.logo_image_url); section('talentProfileLogoArea',!!logoUrl);
    if (logoUrl) {$('talentProfileLogo').src=logoUrl;$('talentProfileLogo').alt=`${t.name||'TALENT'} LOGO`;}
    $('talentProfileSocial').innerHTML = [link('X',t.x_url),link('YOUTUBE',t.youtube_url),...platforms.map(p=>link(p.platform_name,p.platform_url))].join('');
    $('talentProfileText').textContent = t.profile || '';
    const visibleProfile = profileValues.filter(p=>p.value && p.talent_profile_fields?.label && !['illustrator','live2d_modeler'].includes(p.talent_profile_fields?.field_key));
    $('talentProfileData').innerHTML = visibleProfile.map(p=>`<div class="talent-profile-data-row"><dt>${escapeHtml(p.talent_profile_fields.label)}</dt><dd>${escapeHtml(p.value)}</dd></div>`).join('');
    section('talentProfileIntroduction',!!String(t.profile || '').trim());
    // Include creator credits at the end of the profile rows.
    section('talentProfileBasics',visibleProfile.length>0);
    const visibleTags = hashtagValues.filter(p=>p.value && p.talent_hashtag_fields?.label);
    $('talentProfileHashtags').innerHTML = visibleTags.map(p=>`<div class="talent-profile-hashtag"><span class="talent-profile-hashtag-label">${escapeHtml(p.talent_hashtag_fields.label)}</span><span class="talent-profile-hashtag-text">${escapeHtml(p.value)}</span></div>`).join('');
    section('talentHashtagSection',visibleTags.length>0);
    const visibleVoices=voices.filter(v=>safeUrl(v.file_url));
    $('talentProfileVoices').innerHTML=visibleVoices.map(v=>`<div class="talent-profile-voice"><p>${escapeHtml(v.title||'SAMPLE VOICE')}</p><audio controls controlsList="nodownload noplaybackrate" disablePictureInPicture preload="none" src="${escapeHtml(safeUrl(v.file_url))}"></audio></div>`).join('');
    section('talentVoiceSection',visibleVoices.length>0);
    const modelerValue = profileValues.find(p => p.talent_profile_fields?.field_key === 'live2d_modeler')?.value;
    const illustratorValue = profileValues.find(p => p.talent_profile_fields?.field_key === 'illustrator')?.value;
    const creators = [
      ['イラストレーター', t.illustrator_name || illustratorValue, t.illustrator_url],
      ['Live2Dモデラー', modelerValue || t.live2d_modeler_name, t.live2d_modeler_url]
    ].filter(c => String(c[1] || '').trim());
    const creatorRows = creators.map(([label,name,url]) => `<div class="talent-profile-data-row talent-profile-credit-row"><dt>${escapeHtml(label)}</dt><dd>${safeUrl(url) ? link(`${name} ↗`,url,'talent-profile-creator-link') : escapeHtml(name)}</dd></div>`).join('');
    $('talentProfileData').insertAdjacentHTML('beforeend',creatorRows);
    section('talentCreatorSection',false);
    section('talentProfileBasics',visibleProfile.length>0 || creators.length>0);
    section('talentDetailsSection',visibleProfile.length>0 || creators.length>0 || visibleTags.length>0 || !!videoId(t.pickup_video_url));
    const id=videoId(t.pickup_video_url); section('talentMovieSection',!!id);
    if(id){$('talentProfileMovieFrame').innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${escapeHtml(t.pickup_video_title||'PICKUP MOVIE')}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;}
    await loadUpcomingTalentSchedules(t);
    $('talentProfileLoading').hidden=true;$('talentProfileError').hidden=true;$('talentProfileContent').hidden=false;
  } catch(e) {showError(e);}
}

// Display all published schedules on the closest upcoming calendar day.
// Schedule errors must not prevent the TALENT profile from loading.
async function loadUpcomingTalentSchedules(talent) {
  const list = $('talentProfileSchedules');
  const empty = $('talentScheduleEmpty');
  if (!list) return;
  try {
    const {data, error} = await supabaseClient.from('schedules').select('*').limit(500);
    if (error) throw error;
    const today = new Date();
    const localToday = [today.getFullYear(), String(today.getMonth()+1).padStart(2,'0'), String(today.getDate()).padStart(2,'0')].join('-');
    const normalized = (data || []).filter(s => {
      if (s.published === false || s.is_published === false) return false;
      // Different schedule schemas may identify the talent by ID or by name.
      const id = s.talent_id ?? s.talent_uuid;
      if (id != null && String(id) !== String(talent.id)) return false;
      if (id == null) {
        const name = s.talent_name ?? s.talent ?? s.member_name;
        if (!name || String(name).trim() !== String(talent.name).trim()) return false;
      }
      return true;
    }).map(s => {
      const raw = s.stream_date ?? s.date ?? s.schedule_date ?? s.scheduled_date ?? s.scheduled_at ?? s.start_at ?? s.start_date;
      const date = typeof raw === 'string' ? raw.slice(0,10) : '';
      const time = s.start_time ?? s.time ?? (typeof raw === 'string' && raw.includes('T') ? raw.slice(11,16) : '');
      return {...s, _date:date, _time:String(time || '').slice(0,5)};
    }).filter(s => /^\d{4}-\d{2}-\d{2}$/.test(s._date) && s._date >= localToday)
      .sort((a,b) => (a._date + a._time).localeCompare(b._date + b._time));
    const nearest = normalized[0]?._date;
    const selected = nearest ? normalized.filter(s => s._date === nearest) : [];
    list.innerHTML = selected.map(s => {
      const title = escapeHtml(s.title ?? s.stream_title ?? '配信予定');
      const url = safeUrl(s.url ?? s.stream_url ?? s.youtube_url ?? s.broadcast_url);
      const dateText = `${escapeHtml(s._date.replaceAll('-','/'))}${s._time ? '　'+escapeHtml(s._time) : ''}`;
      return `<article class="talent-schedule-card"><div class="talent-schedule-date">${dateText}</div><p class="talent-schedule-title">${url ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${title}</a>` : title}</p></article>`;
    }).join('');
    list.hidden = !selected.length;
    if (empty) empty.hidden = !!selected.length;
  } catch (err) {
    console.warn('配信予定の取得に失敗:',err);
    list.hidden = true;
    if (empty) { empty.hidden = false; empty.textContent = '配信予定はSCHEDULEページで確認'; }
  }
}

// DOMContentLoaded が既に発火済みでも読み込みを開始
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadTalentProfile, {once:true});
} else {
  loadTalentProfile();
}
