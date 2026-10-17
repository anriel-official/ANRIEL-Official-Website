// AN:RIEL - 公開中の週間スケジュール画像を表示
(async () => {
  const section = document.getElementById('weeklySchedule');
  const img = document.getElementById('weeklyScheduleImage');
  if (!section || !img) return;

  try {
    if (typeof supabaseClient === 'undefined') {
      console.error('[Weekly Schedule] Supabase client not found');
      return;
    }

    const { data, error } = await supabaseClient
      .from('weekly_schedule_settings')
      .select('image_url,published')
      .eq('id', 1)
      .maybeSingle();

    if (error) throw error;
    if (!data || !data.published || !data.image_url) return;

    // hidden 内の loading="lazy" は読み込みが始まらず、
    // onload が発火しない場合があるため eager を明示する。
    img.loading = 'eager';
    img.onload = () => { section.hidden = false; };
    img.onerror = () => {
      section.hidden = true;
      console.error('[Weekly Schedule] Image failed to load:', data.image_url);
    };
    img.src = data.image_url;
    if (img.complete && img.naturalWidth > 0) section.hidden = false;
  } catch (error) {
    console.error('[Weekly Schedule] Failed to load settings:', error);
  }
})();
