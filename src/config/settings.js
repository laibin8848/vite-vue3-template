import { name } from '../../package.json'

const defaultSetting = {
  title: name,
  /**
   * @type {boolean} true | false
   * @description whether fix the header
  */
  fixedHeader: false,
  /**
   * @type {boolean} true | false
   * @description whether show the logo in sidebar
  */
  sideBarLogo: true,
  /**
   * @type {boolean} true | false
   * @description whether show the rightPanel // 设置中心
  */
  showSettings: false,
};

export default defaultSetting;
