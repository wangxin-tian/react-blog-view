import { observable, action, makeObservable, configure, computed } from 'mobx';

configure({
  enforceActions: 'observed',
});

const defaultUser = {
  id: '',
  token: '',
  username: '',
  password: '',
  recommendIdList: [],
};

class UserStore {
  constructor() {
    makeObservable(this);
  }

  @observable user: User = defaultUser;
  init = false;

  @action
  login(nUser: typeof this.user) {
    this.user = nUser;
    this.init = true;
    if (nUser.token) localStorage.setItem('token', nUser.token);
  }

  @action
  logout() {
    this.user = { ...defaultUser };
    this.init = true;
    localStorage.removeItem('token');
  }

  @computed
  get isLogin() {
    if (this.user.token) return true;
    return false;
  }
}

const userStore = new UserStore();

export default userStore;
