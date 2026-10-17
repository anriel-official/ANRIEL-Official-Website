(() => {
  'use strict';
  const db = typeof supabaseClient !== 'undefined' ? supabaseClient : null;
  const $ = id => document.getElementById(id);
  const PAGE_SIZE = 10;
  const STATUS = { unread:'未対応', in_progress:'対応中', completed:'対応済み' };
  let canEdit = false, current = null, activeTab = 'messages';
  const states = {
    messages:{ page:0, total:0, items:[], filters:{search:'',category:'all',read:'all',status:'all'} },
    favorites:{ page:0, total:0, items:[], filters:{search:'',category:'all',read:'all',status:'all'} }
  };
  let categories = [];
  function feedback(msg, error=false){ $('contactFeedback').textContent=msg; $('contactFeedback').classList.toggle('error',error); }
  function errorMessage(err){ console.error('CONTACT管理:',err); feedback(err?.message || '処理に失敗',true); }
  function td(value){ const e=document.createElement('td'); e.textContent=String(value ?? ''); return e; }
  function btn(label, fn, cls='contact-btn'){ const e=document.createElement('button'); e.type='button'; e.className=cls; e.textContent=label; e.addEventListener('click',fn); return e; }
  function dateText(value){ return value ? new Date(value).toLocaleString('ja-JP') : ''; }
  function escapeLike(s){ return s.replace(/[\\%_]/g, '\\$&'); }
  function option(select,value,label){ const e=document.createElement('option');e.value=value;e.textContent=label;select.append(e); }
  function buildFilters(tab){
    const host=$(tab==='messages'?'filtersMessages':'filtersFavorites');
    host.replaceChildren(); const grid=document.createElement('div');grid.className='contact-filters';
    const controls=[
      ['search','文字検索','text',[['','名前・メールアドレス・本文を検索']]],
      ['category','お問い合わせ種別','select',[['all','すべて'],...categories.map(x=>[x,x])]],
      ['read','既読状態','select',[['all','すべて'],['false','未読'],['true','既読']]],
      ['status','対応状況','select',[['all','すべて'],['unread','未対応'],['in_progress','対応中'],['completed','対応済み']]]
    ];
    controls.forEach(([key,label,type,opts])=>{
      const group=document.createElement('div');group.className='form-group';
      const l=document.createElement('label'); const id=tab+'-'+key;l.htmlFor=id;l.textContent=label;
      const input=document.createElement(type==='select'?'select':'input');input.id=id;
      if(type!=='select')input.type=type;
      if(type==='select')opts.forEach(([v,t])=>option(input,v,t));
      if(type==='text')input.placeholder=opts[0][1];
      input.value=states[tab].filters[key];
      const apply=()=>{ states[tab].filters[key]=input.value;states[tab].page=0;loadList(tab); };
      if(key==='search'){
        let timer;input.addEventListener('input',()=>{clearTimeout(timer);timer=setTimeout(apply,350);});
        input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();clearTimeout(timer);apply();}});
      } else input.addEventListener('change',apply);
      group.append(l,input);grid.append(group);
    });
    const actions=document.createElement('div');actions.className='contact-filter-actions';
    actions.append(btn('絞り込み解除',()=>{states[tab].filters={search:'',category:'all',read:'all',status:'all'};states[tab].page=0;buildFilters(tab);loadList(tab);},'admin-secondary-button'));
    grid.append(actions);host.append(grid);
  }
  async function loadCategories(){
    // お問い合わせデータに登録済みの種別を全件走査（ページ単位）。
    const found=new Set();
    for(let start=0;start<100000;start+=1000){
      const {data,error}=await db.from('contact_messages').select('category').order('created_at',{ascending:false}).range(start,start+999);
      if(error){console.warn('カテゴリー取得:',error);break;}
      (data||[]).forEach(x=>{if(x.category)found.add(x.category);});
      if(!data||data.length<1000)break;
    }
    categories=[...found].sort((a,b)=>a.localeCompare(b,'ja'));
    buildFilters('messages');buildFilters('favorites');
  }
  async function loadList(tab){
    const state=states[tab], f=state.filters, body=$(tab==='messages'?'messagesBody':'favoritesBody');
    const requestId=Symbol();state.requestId=requestId;
    body.replaceChildren();const tr=document.createElement('tr');const cell=td('読み込み中...');cell.colSpan=6;cell.className='contact-empty';tr.append(cell);body.append(tr);
    let query=db.from('contact_messages').select('id,name,email,category,message,status,admin_note,created_at,is_read,is_favorite',{count:'exact'});
    if(tab==='favorites')query=query.eq('is_favorite',true);
    if(f.category!=='all')query=query.eq('category',f.category);
    if(f.read!=='all')query=query.eq('is_read',f.read==='true');
    if(f.status!=='all')query=query.eq('status',f.status);
    if(f.search.trim()){
      const q=escapeLike(f.search.trim()).replace(/[(),]/g,' ');
      if(q.trim())query=query.or(`name.ilike.%${q}%,email.ilike.%${q}%,message.ilike.%${q}%`);
    }
    query=query.order('created_at',{ascending:false}).range(state.page*PAGE_SIZE,(state.page+1)*PAGE_SIZE-1);
    const {data,count,error}=await query;
    if(state.requestId!==requestId)return;
    if(error){body.replaceChildren();const row=document.createElement('tr');const c=td('取得失敗: '+error.message);c.colSpan=6;c.className='contact-empty';row.append(c);body.append(row);return errorMessage(error);}
    state.items=data||[];state.total=count||0;
    if(state.page>0&&!state.items.length&&state.total>0){state.page--;return loadList(tab);}
    renderList(tab);
  }
  function renderList(tab){
    const state=states[tab], body=$(tab==='messages'?'messagesBody':'favoritesBody');body.replaceChildren();
    if(!state.items.length){const row=document.createElement('tr'),cell=td(tab==='favorites'?'お気に入りはありません':'お問い合わせはありません');cell.colSpan=6;cell.className='contact-empty';row.append(cell);body.append(row);}
    state.items.forEach(item=>{
      const row=document.createElement('tr');row.dataset.id=item.id;row.tabIndex=0;if(!item.is_read)row.classList.add('is-unread');
      const starCell=document.createElement('td');const star=btn(item.is_favorite?'★':'☆',e=>toggleFavorite(item,e),'contact-star'+(item.is_favorite?' active':''));star.title=item.is_favorite?'お気に入り解除':'お気に入り登録';star.setAttribute('aria-label',star.title);star.disabled=!canEdit;starCell.append(star);
      const readCell=document.createElement('td'),readLabel=document.createElement('span');readLabel.className='contact-read-label'+(item.is_read?'':' unread');readLabel.textContent=item.is_read?'既読':'未読';readCell.append(readLabel);
      row.append(starCell,readCell,td(dateText(item.created_at)),td(item.name),td(item.category),td(STATUS[item.status]||item.status));
      row.addEventListener('click',()=>openDetail(item));row.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target===row)openDetail(item);});body.append(row);
    });
    const fav=tab==='favorites';$(fav?'favPageLabel':'pageLabel').textContent=`${state.page+1} / ${Math.max(1,Math.ceil(state.total/PAGE_SIZE))}`;
    $(fav?'favPrevPage':'prevPage').disabled=state.page===0;
    $(fav?'favNextPage':'nextPage').disabled=(state.page+1)*PAGE_SIZE>=state.total;
    $(fav?'favoritesCount':'messagesCount').textContent=`${state.total}件`;
  }
  async function toggleFavorite(item,event){
    event.stopPropagation();if(!canEdit)return;
    const {error}=await db.from('contact_messages').update({is_favorite:!item.is_favorite}).eq('id',item.id);
    if(error)return errorMessage(error);
    await Promise.all([loadList('messages'),loadList('favorites')]);feedback('お気に入りを更新');
  }
  async function openDetail(item){
    current={...item};$('detailName').textContent=item.name;$('detailEmail').textContent=item.email;$('detailCategory').textContent=item.category;$('detailDate').textContent=dateText(item.created_at);$('detailMessage').textContent=item.message;$('detailStatus').value=item.status;$('detailNote').value=item.admin_note||'';$('detailRead').value=String(!!item.is_read);$('detailFavorite').value=String(!!item.is_favorite);
    $('messageDetail').hidden=false;$('messageDetail').scrollIntoView({behavior:'smooth',block:'start'});
    if(canEdit&&!item.is_read){const {error}=await db.from('contact_messages').update({is_read:true}).eq('id',item.id);if(error)return errorMessage(error);current.is_read=true;$('detailRead').value='true';await Promise.all([loadList('messages'),loadList('favorites')]);}
  }
  async function saveMessage(){
    if(!canEdit||!current)return;$('saveMessage').disabled=true;
    try{const {error}=await db.from('contact_messages').update({status:$('detailStatus').value,admin_note:$('detailNote').value,is_read:$('detailRead').value==='true',is_favorite:$('detailFavorite').value==='true'}).eq('id',current.id);if(error)throw error;$('messageDetail').hidden=true;current=null;await Promise.all([loadList('messages'),loadList('favorites')]);feedback('変更を保存');}catch(e){errorMessage(e);}finally{$('saveMessage').disabled=false;}
  }
  async function deleteMessage(){
    if(!canEdit||!current||!confirm('このお問い合わせを削除しますか？\n削除後は元に戻せません。'))return;
    $('deleteMessage').disabled=true;try{const {error}=await db.from('contact_messages').delete().eq('id',current.id);if(error)throw error;current=null;$('messageDetail').hidden=true;await Promise.all([loadList('messages'),loadList('favorites')]);feedback('お問い合わせを削除');}catch(e){errorMessage(e);}finally{$('deleteMessage').disabled=false;}
  }
  let notifications=[];
  async function loadNotifications(){const {data,error}=await db.from('contact_notification_emails').select('id,email,is_enabled,created_at').order('created_at',{ascending:true});if(error)return errorMessage(error);notifications=data||[];renderNotifications();}
  function renderNotifications(){const body=$('notificationsBody');body.replaceChildren();if(!notifications.length){const row=document.createElement('tr'),cell=td('通知先は未登録');cell.colSpan=3;cell.className='contact-empty';row.append(cell);body.append(row);}notifications.forEach(item=>{const row=document.createElement('tr');row.append(td(item.email),td(item.is_enabled?'ON':'OFF'));const actions=document.createElement('td');if(canEdit){actions.append(btn(item.is_enabled?'OFFにする':'ONにする',()=>updateNotification(item.id,{is_enabled:!item.is_enabled})),document.createTextNode(' '),btn('編集',()=>editNotification(item)),document.createTextNode(' '),btn('削除',()=>removeNotification(item),'contact-btn danger'));}else actions.textContent='閲覧のみ';row.append(actions);body.append(row);});}
  async function addNotification(e){e.preventDefault();if(!canEdit)return;const input=$('newNotificationEmail');if(!input.reportValidity())return;const email=input.value.trim().toLowerCase();const {error}=await db.from('contact_notification_emails').insert({email,is_enabled:true});if(error)return errorMessage(error);input.value='';await loadNotifications();feedback('通知先を追加');}
  async function updateNotification(id,changes){if(!canEdit)return;const {error}=await db.from('contact_notification_emails').update(changes).eq('id',id);if(error)return errorMessage(error);await loadNotifications();feedback('通知設定を更新');}
  function editNotification(item){if(!canEdit)return;const next=prompt('通知先メールアドレス',item.email);if(next===null)return;const email=next.trim().toLowerCase();if(!email||email.length>254||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return feedback('メールアドレスを確認',true);updateNotification(item.id,{email});}
  async function removeNotification(item){if(!canEdit||!confirm(`${item.email} を通知先から削除しますか？`))return;const {error}=await db.from('contact_notification_emails').delete().eq('id',item.id);if(error)return errorMessage(error);await loadNotifications();feedback('通知先を削除');}
  function switchTab(tab){activeTab=tab;['messages','favorites','notifications'].forEach(t=>{const suffix=t==='messages'?'Messages':t==='favorites'?'Favorites':'Notifications';$('panel'+suffix).classList.toggle('active',t===tab);$('tab'+suffix).classList.toggle('active',t===tab);$('tab'+suffix).setAttribute('aria-selected',String(t===tab));});$('messageDetail').hidden=true;current=null;feedback('');if(tab==='notifications')loadNotifications();else loadList(tab);}
  async function initialize(){
    if(!db)return feedback('Supabaseの初期化に失敗',true);
    const {data:{user},error:authError}=await db.auth.getUser();if(authError||!user){location.replace('../login.html');return;}
    const {data:canView,error:viewError}=await db.rpc('has_admin_feature_permission',{requested_feature:'contact',requested_action:'view'});if(viewError||!canView){location.replace('../index.html');return;}
    const {data:edit,error:editError}=await db.rpc('has_admin_feature_permission',{requested_feature:'contact',requested_action:'edit'});if(editError)return errorMessage(editError);canEdit=!!edit;
    ['detailStatus','detailNote','detailRead','detailFavorite'].forEach(id=>$(id).disabled=!canEdit);
    ['saveMessage','deleteMessage','notificationEditor'].forEach(id=>$(id).hidden=!canEdit);
    const account=await db.functions.invoke('admin-account',{method:'GET'});if(account.error||!account.data?.user?.is_active){location.replace('../index.html');return;}if(account.data.user.must_change_password){location.replace('../account/index.html');return;}
    const menu=$('contactPermissionsMenu');if(menu&&['owner','engineer'].includes(account.data.user.role))menu.hidden=false;
    ['messages','favorites','notifications'].forEach(tab=>{const suffix=tab==='messages'?'Messages':tab==='favorites'?'Favorites':'Notifications';$('tab'+suffix).addEventListener('click',()=>switchTab(tab));});
    $('refreshMessages').addEventListener('click',()=>loadList('messages'));$('refreshFavorites').addEventListener('click',()=>loadList('favorites'));
    [['prevPage','messages',-1],['nextPage','messages',1],['favPrevPage','favorites',-1],['favNextPage','favorites',1]].forEach(([id,tab,delta])=>$(id).addEventListener('click',()=>{const s=states[tab];const next=s.page+delta;if(next>=0&&next<Math.max(1,Math.ceil(s.total/PAGE_SIZE))){s.page=next;loadList(tab);}}));
    $('saveMessage').addEventListener('click',saveMessage);$('deleteMessage').addEventListener('click',deleteMessage);
    ['closeDetail','closeDetailBottom'].forEach(id=>$(id).addEventListener('click',()=>{$('messageDetail').hidden=true;current=null;}));
    $('addNotificationForm').addEventListener('submit',addNotification);
    $('logoutButton').addEventListener('click',async()=>{const {error}=await db.auth.signOut();if(error)return errorMessage(error);location.replace('../login.html');});
    buildFilters('messages');buildFilters('favorites');document.body.classList.add('contact-access-ready');
    await loadCategories();await loadList('messages');
  }
  initialize().catch(errorMessage);
})();
