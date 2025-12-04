(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const viewingUserId = urlParams.get('userId');
  const viewingUserName = urlParams.get('userName');
  
  if (viewingUserId && viewingUserName) {
    const backLinks = document.querySelectorAll('.btn-back-dashboard');
    backLinks.forEach((link) => {
      link.setAttribute('href', `/dashboard?userId=${viewingUserId}&userName=${viewingUserName}`);
    });
    
    const dashboardLinks = document.querySelectorAll('a[href="/dashboard"]');
    dashboardLinks.forEach((link) => {
      link.setAttribute('href', `/dashboard?userId=${viewingUserId}&userName=${viewingUserName}`);
    });
  }
})();
