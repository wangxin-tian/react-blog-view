import { observable, action, makeObservable, configure } from 'mobx';

configure({
    enforceActions: 'observed', // 允许你可以在actions外部创建可观察的对象然后自由地修改
});

class KwStore {
    constructor() {
        makeObservable(this);
    }

    @observable kw = '';
    
    @action 
    setKw(str: string) {
        this.kw = str;
    }
};

const kwStore = new KwStore();

export default kwStore;