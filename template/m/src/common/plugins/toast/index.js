import vToast from './toast.vue';

const Toast = {};

// 注册Toast
Toast.install = (Vue) => {
  // 生成一个Vue的子类
  // 同时这个子类也就是组件
  const ToastConstructor = Vue.extend(vToast);
  // 生成一个该子类的实例
  const instance = new ToastConstructor();
  // console.log(instance)
  // 将这个实例挂载在我创建的div上
  // 并将此div加入全局挂载点内部
  instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.$el);

  // 通过Vue的原型注册一个方法
  // 让所有实例共享这个方法 
  Vue.prototype.$toast = (msg, druction = 2000) => {
    if(instance.visible) return;
    instance.message = msg;
    instance.visible = true;
    setTimeout(()=>{
      instance.visible = false;
    }, druction)
  }
}

export default Toast
