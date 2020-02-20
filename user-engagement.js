import moment from 'moment';
// the CMS is not able to wrap the content of the
// user engagement cards in an anchor tag
// this module is responsible for ensuring that
// the card navigates to appropriate link when clicked or tabbed into
class UserEngagement {
  constructor(userEngagement) {
    this.userEngagement = userEngagement;
    this.href = userEngagement.querySelector('.user-engagement--content a')
    && userEngagement.querySelector('.user-engagement--content a').getAttribute('href');
    this.countdownWrapper = userEngagement.querySelector('.user-engagement--countdown-left');
    this.date = userEngagement.querySelector('.user-engagement--countdown-left') 
      && userEngagement.querySelector('.user-engagement--countdown-left')
        .getAttribute('data-deadline-date');
    this.dateType = userEngagement.querySelector('.user-engagement--date-type') 
    && userEngagement.querySelector('.user-engagement--date-type')
      .getAttribute('data-date-type'); 
    this.cta = userEngagement.querySelector('.user-engagement--cta');
    this.isLargeEngagement = userEngagement.classList.contains('user-engagement--large');
  }

  navigateToHref = () => {
    if (!this.isLargeEngagement) {
      window.location = this.href;
    }
  }

  handleEnter = (e) => {
    if (e.keyCode === 13 && !this.isLargeEngagement) {
      navigateToHref();
    }
  }

  handleCountdownDisplay = () => {
    const today = moment();
    const deadline = moment(this.date);
    const daysUntilDeadline = deadline.diff(today, 'days') + 1; // 1 is added to offset the zero index 
    
    const span = document.createElement('span');
    if (daysUntilDeadline <= 7 && daysUntilDeadline > 0) {
      span.innerText = ` ${daysUntilDeadline} ${daysUntilDeadline === 1 ? 'day' : 'days'} to enter`;
      this.countdownWrapper.appendChild(span);
    } else if (daysUntilDeadline > 7) {
      span.innerText = ` enter by ${deadline.format('MMMM D')}`;
      this.countdownWrapper.appendChild(span);
    } else if (daysUntilDeadline <= 0) {
      span.innerText = ' deadline has passed';
      this.countdownWrapper.appendChild(span);
    }
  }

  init = () => {
    if (this.href) {
      this.userEngagement.addEventListener('click', this.navigateToHref);
      this.userEngagement.addEventListener('keydown', this.handleEnter);
    }
    if (this.date) {
      this.handleCountdownDisplay();
    }
  }

  destroy = () => {
    if (this.href) {
      this.userEngagement.removeEventListener('click', this.navigateToHref);
      this.userEngagement.removeEventListener('keydown', this.handleEnter);
    }
  }
}
class UserEngagements {
  init = () => {
    let userEngagementComponents = [...document.getElementsByClassName('user-engagement--single')];
    this.userEngagementComponents = userEngagementComponents
      .map(component => new UserEngagement(component));
    this.userEngagementComponents.forEach(component => component.init());
  }

  destroy = () => {
    this.userEngagementComponents.forEach(component => component.destroy());
  }
}

export default new UserEngagements();
