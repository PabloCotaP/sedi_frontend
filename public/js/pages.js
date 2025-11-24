(function(){
  const headerEmailElement = document.querySelector('header p.text-sm.opacity-90');
  const email = localStorage.getItem('user_email');
  if (!email && headerEmailElement) {
    window.location.href = '/';
    return;
  }
  if (headerEmailElement) {
    headerEmailElement.textContent = email;
  }
})();
