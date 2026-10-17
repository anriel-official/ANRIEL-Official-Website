// AN:RIEL weekly schedule image management.
(() => {
  const $ = id => document.getElementById(id);
  const input = $('weeklyFile'), drop = $('weeklyDropzone'), preview = $('weeklyPreview');
  const publish = $('weeklyPublished'), message = $('weeklyMessage');
  const save = $('weeklySave'), remove = $('weeklyDelete');
  const bucket = 'news-images';
  let selected = null, saved = null;
  const notify = text => { message.textContent = text; };
  const show = url => { preview.style.display = url ? 'block' : 'none'; if (url) preview.src = url; else preview.removeAttribute('src'); };
  function pick(file) {
    if (!file) return;
    if (!['image/jpeg','image/png','image/webp','image/gif'].includes(file.type) || file.size > 5*1024*1024) {
      notify('JPG・PNG・WebP・GIF、5MB以下の画像を選択'); return;
    }
    selected = file;
    show(URL.createObjectURL(file));
    notify('画像を選択中。保存すると反映');
  }
  drop?.addEventListener('click', () => input.click());
  drop?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
  input?.addEventListener('change', () => pick(input.files[0]));
  drop?.addEventListener('dragover', e => { e.preventDefault(); drop.classList.add('dragover'); });
  drop?.addEventListener('dragleave', () => drop.classList.remove('dragover'));
  drop?.addEventListener('drop', e => { e.preventDefault(); drop.classList.remove('dragover'); pick(e.dataTransfer.files[0]); });
  window.loadWeeklySchedule = async () => {
    notify('読み込み中...');
    const {data,error} = await supabaseClient.from('weekly_schedule_settings').select('*').eq('id',1).maybeSingle();
    if (error) { notify('読み込み失敗：SQL設定・権限を確認 ('+error.message+')'); return; }
    saved = data; selected = null; publish.checked = !!data?.published; show(data?.image_url || '');
    notify(data?.image_url ? '登録済み' : '画像未登録');
  };
  save?.addEventListener('click', async () => {
    save.disabled = true;
    notify('保存中...');
    try {
      let image_url = saved?.image_url || null, image_path = saved?.image_path || null;
      let uploadedPath = null;
      if (selected) {
        selected = await window.ANRIELImageOptimizer.optimize(selected, 'weekly');
        const ext = { 'image/jpeg':'jpg', 'image/png':'png', 'image/webp':'webp', 'image/gif':'gif' }[selected.type];
        uploadedPath = `weekly-schedule/${Date.now()}-${crypto.randomUUID()}.${ext}`;
        const result = await supabaseClient.storage.from(bucket).upload(uploadedPath, selected, {contentType:selected.type,upsert:false});
        if (result.error) throw result.error;
        image_path = uploadedPath;
        image_url = supabaseClient.storage.from(bucket).getPublicUrl(uploadedPath).data.publicUrl;
      }
      const {error} = await supabaseClient.from('weekly_schedule_settings').upsert({id:1,image_url,image_path,published:!!publish.checked && !!image_url},{onConflict:'id'});
      if (error) { if (uploadedPath) await supabaseClient.storage.from(bucket).remove([uploadedPath]); throw error; }
      notify('保存完了'); await window.loadWeeklySchedule();
    } catch(e) { notify('保存失敗：'+e.message); }
    finally { save.disabled = false; }
  });
  remove?.addEventListener('click', async () => {
    if (!confirm('週間スケジュール画像を削除しますか？')) return;
    remove.disabled = true;
    const {error} = await supabaseClient.from('weekly_schedule_settings').upsert({id:1,image_url:null,image_path:null,published:false},{onConflict:'id'});
    if (error) notify('削除失敗：'+error.message);
    else { selected = null; input.value = ''; await window.loadWeeklySchedule(); notify('画像を削除しました'); }
    remove.disabled = false;
  });
})();
