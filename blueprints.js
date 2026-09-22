const toast=document.querySelector('.toast');
document.querySelectorAll('.blueprint-card').forEach(card=>{
  const btn=card.querySelector('.copy-blueprint');
  const status=card.querySelector('.bp-fetch');
  let timer=null;
  card.addEventListener('click',e=>{
    if(!e.target.closest('.copy-blueprint'))return;
    if(btn.disabled)return;
    const code=card.dataset.code;
    // 进入"获取中"状态
    btn.disabled=true;
    btn.innerHTML='<span class="spin"></span> 获取中…';
    status.hidden=false;
    status.className='bp-fetch loading';
    status.innerHTML='<span class="spin"></span> 正在获取蓝图分享码…<small>预计需要 30 秒左右，请稍候。</small>';
    // 30 秒后判定失败
    timer=setTimeout(()=>{
      btn.disabled=false;
      btn.innerHTML='重新获取分享码 <b>⧉</b>';
      status.className='bp-fetch failed';
      status.innerHTML='<b>获取失败</b><span>服务端忙碌中，请稍后再试。如果你有好的蓝图，欢迎联系服主提交！</span>';
      toast.textContent='服务端忙碌中，请稍后再试';
      toast.classList.add('show');
      setTimeout(()=>toast.classList.remove('show'),2600);
    },30000);
  });
});
