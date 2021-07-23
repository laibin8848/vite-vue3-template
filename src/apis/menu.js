import request from "@/utils/request";
import { store } from '@/store';
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'


export const saveMenu = (item) =>{
    return new Promise(resolve=>{
      axios.post('/system/menu/saveBatch',item)
      .then(res => {
        resolve(res)
      })
      .catch(function (error) { // 请求失败处理
        console.log(error);
      });
    })
}
export const getMenuList = () => {
    return new Promise(reslove => {
        axios.get('/system/menu/tree', {
            params: {}
        })
        .then(function (res) {
            console.log(res.data.result, 123);
            if(res.status===200){
                const data = res.data && res.data.result;
                store.commit('permissionModule/setMenuList', data);
                reslove(res.data)
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    })
}

export const delMenu = (row) => {
    return new Promise(reslove => {
        axios.get('/system/menu/delete/' + row.id, {
            params: {}
        })
            .then(function (res) {
                //console.log(response, 123);
                if (res.code === 200) {
                    const list = store.state.permissionModule.menuList;
                    outer: for (var i = list.length - 1; i >= 0; i--) {
                        if (list[i].id == row.id) {
                            list.splice(i, 1);
                            break outer;
                        }
                        if (list[i].submenu && list[i].submenu.length) {
                            for (var j = list[i].submenu.length - 1; j >= 0; j--) {
                                if (list[i].submenu[j].id == row.id) {
                                    list[i].submenu.splice(j, 1);
                                    break outer;
                                }
                            }
                        }
                    }
                    store.commit('permissionModule/setMenuList', list);

                } else {
                    ElMessage({type: 'success',message: '删除失败'});
                    getMenuList()
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        // setTimeout(() => {
        //     reslove({
        //         code: 200
        //     })
        // }, 1000)
    })
}
