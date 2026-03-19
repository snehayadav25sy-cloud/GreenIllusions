/**
 * If site is being framed and not within the same host,
 * hide the page. @see https://www.hacksplaining.com/prevention/click-jacking
 */
if ((top === self) || (top.location.hostname === self.location.hostname)) {
  document.body.setAttribute('style', 'display: block !important');
}
