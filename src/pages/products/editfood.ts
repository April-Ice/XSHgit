import {
	Component
} from '@angular/core';
import {
	NavController,
	NavParams,
	AlertController,
	LoadingController,
	ToastController
} from 'ionic-angular';
import {
	ProductService
} from '../../providers/product';
import {
	ListPage
} from '../list/list';


@Component({
	selector: 'page-editfood',
	templateUrl: 'editfood.html',
	providers: [ProductService],
})
export class EditFoods {

	public menuList = []; //菜单列表
	public curMenu = null; //当前菜单
	public curMenuId = this.navParams.get('menuId'); //当前菜单Id
	public curMenuTotalMoney = 0;//当前菜单总价

	public accountDishTypeList = []; //当前账户菜品分类列表
	public curAccountDishType = null; //当前账户菜品分类
	public accountDishList = []; //当前账户全部菜品
	public addDishType = false; //添加菜品分类
	public addDishTypeName = "";//添加菜品分类名称

	public dishTypeList = []; //当前菜品分类列表
	public curDishType = null; //当前菜品分类
	public dishList = []; //当前菜单菜品

	public dishTypeModal = false; //菜品分类弹窗
	public addOrEditDishModal=false;//菜品新增/编辑弹窗
	public addOrEditDish={
		id:0,
		img:"",
		dishType:null,
		name:"",
		price:0,
		cost:0,
		unit:"",
		description:""
	};
	public curEditDish=null;//当前编辑的菜品
	public oriDishTypeList=[];
	public DelByContent=false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public alertCtrl: AlertController,
		public loadingCtrl: LoadingController,
		public toastCtrl: ToastController,
		public service: ProductService
	) {
		this.GetMemu();
	}

	DeepClone(obj) {
		var newObj = obj instanceof Array ? [] : {};
		if(typeof obj !== 'object') {
			return obj;
		} else {
			for(var i in obj) {
				newObj[i] = typeof obj[i] === 'object' ? this.DeepClone(obj[i]):obj[i];
			}
		}
		return newObj;
	}
	//获取菜单列表及全部菜品分类
	GetMemu() {
		this.service.GetMealMemu().then(res => {
			if (res.status == 1) {
				this.menuList = res.list;
				for (let i = 0; i < this.menuList.length; i++) {
					const element = this.menuList[i];
					if (element.id = this.curMenuId) {
						this.curMenu = element;
						break;
					}
				}

				this.oriDishTypeList=this.DeepClone(res.type);
				this.accountDishTypeList = res.type;
				this.accountDishTypeList.splice(0, 0, {
					id: 0,
					name: "全部"
				})
				this.curAccountDishType = this.accountDishTypeList[0];
				this.GetAccountDishes();
				this.GetDishTypesDishNum();
			}
		});
	}
	//获取菜品分类包含菜品数量
	GetDishTypesDishNum() {
		this.service.GetDishTypesDishNum(this.curMenu.id).then(res => {
			if (res.status == 1) {
				this.dishTypeList = res.list;
				this.dishTypeList.splice(0, 0, {
					id: 0,
					name: "全部",
					count: 0
				})
				this.dishTypeList.forEach(element => {
					this.dishTypeList[0].count += parseInt(element.count);
				});
				this.curDishType = this.dishTypeList[0];
				this.curMenuTotalMoney=res.totalMoney;
				this.GetMenuDetail();
			}
		})
	}
	//获取菜单菜品
	GetMenuDetail() {
		this.dishList = [];
		this.service.GetMenuDetail(this.curMenu.id, this.curDishType.id).then(data => {
			if (data.status == 1) {
				this.dishList = data.dishes;
				console.log(this.dishList);
			}
		});
	}
	//变更菜品分类
	ChangeDishType(dishType) {
		this.curDishType = dishType;
		this.GetMenuDetail();
	}
	//变更当前账户菜品分类
	ChangeAccountDishType(dishType) {
		this.curAccountDishType = dishType;
		this.GetAccountDishes();
	}
	//获取当前账户菜品
	GetAccountDishes() {
		this.accountDishList = [];
		this.service.GetAccountDishes(this.curAccountDishType.id,this.curMenu.id).then(res => {
			if (res.status == 1) {
				this.accountDishList = res.list;
			}
		})
	}

	/**菜品分类 */
	//打开菜品分类弹窗
	OpenDishTypeModal() {
		this.dishTypeModal = true;
	}
	//关闭菜品分类弹窗
	CloseDishTypeModal() {
		this.dishTypeModal = false;
	}
	//添加菜品分类
	AddDishType() {
		this.addDishType = true;
		this.addDishTypeName = "";
	}
	//取消添加菜品分类
	CancelAddDishType() {
		this.addDishType = false;
	}
	//添加菜品分类确认
	AddDishTypeConfirm() {
		if (this.addDishTypeName == "") {
			this.toastCtrl.create({
				message: '请输入分类名称！',
				position: 'middle',
				duration: 1000
			}).present();
			return;
		}
		this.service.AddDishType(this.addDishTypeName).then(res => {
			if (res.status == 1) {
				this.oriDishTypeList.push({
					id: res.msg,
					name: this.addDishTypeName
				});
				this.accountDishTypeList.push({
					id: res.msg,
					name: this.addDishTypeName
				});
				this.addDishTypeName = "";
				this.CancelAddDishType();
			} else {
				this.toastCtrl.create({
					message: '添加失败！',
					position: 'middle',
					duration: 1000
				}).present();
			}
		})
	}
	//编辑菜品分类
	EditDishType(dishType) {
		dishType.edit = true;
		dishType.editName = dishType.name;
	}
	//取消编辑菜品分类
	CancelEditDishType(dishType) {
		dishType.edit = false;
	}
	//编辑菜品分类确认
	EditDishTypeConfirm(dishType) {
		if (dishType.editName == '') {
			this.toastCtrl.create({
				message: '请输入分类名称！',
				position: 'middle',
				duration: 1000
			}).present();
			return;
		}
		this.service.EditDishType(dishType.id, dishType.editName).then(res => {
			if (res.status == 1) {
				dishType.name = dishType.editName;
				dishType.edit = false;
				for (let index = 0; index < this.accountDishTypeList.length; index++) {
					const element = this.accountDishTypeList[index];
					if(element.id==dishType.id){
						element.name=dishType.name;
						break;
					}
				}
				for (let index = 0; index < this.dishTypeList.length; index++) {
					const element = this.dishTypeList[index];
					if(element.id==dishType.id){
						element.name=dishType.name;
						break;
					}
				}
			} else {
				this.toastCtrl.create({
					message: '编辑失败！',
					position: 'middle',
					duration: 1000
				}).present();
			}
		})
	}
	//删除菜品分类
	DelDishType(dishType, index) {
		this.alertCtrl.create({
			title: '确定删除' + dishType.name + '?',
			buttons: [{
					text: '确定',
					handler: data => {
						let has = false;
						for (let i = 0; i < this.dishList.length; i++) {
							const element = this.dishList[i];
							if (element.service_type == dishType.id) {
								has = true;
								break;
							}
						}

						if (has) {
							this.toastCtrl.create({
								message: '该分类下还有菜品！',
								position: 'middle',
								duration: 2000
							}).present();
							return;
						}
						this.service.DelDishType(dishType.id).then(res => {
							if (res.status == 1) {
								this.oriDishTypeList.splice(index, 1);
								for (let index = 0; index < this.accountDishTypeList.length; index++) {
									const element = this.accountDishTypeList[index];
									if(element.id==dishType.id){
										this.accountDishTypeList.splice(index,1);
										break;
									}
								}
							} else if (res.status == 2) {
								this.toastCtrl.create({
									message: '该分类下还有菜品！',
									position: 'middle',
									duration: 2000
								}).present();
							} else {
								this.toastCtrl.create({
									message: '删除失败！',
									position: 'middle',
									duration: 1000
								}).present();
							}
						})
					}
				},
				{
					text: "取消"
				}
			]
		}).present();
	}
	//编辑菜单菜品
	EditMenuDish(dish){
		dish.edit=true;
		dish.editPrice=dish.dishes_price;
		dish.editCount=dish.dishes_count;
	}
	//取消编辑菜单菜品
	CancelEditMenuDish(dish){
		dish.edit=false;
	}
	//编辑菜单菜品确认
	EditMenuDishConfirm(dish){
		if(dish.editPrice<=0){
			this.toastCtrl.create({
				message: '请输入菜品价格！',
				position: 'middle',
				duration: 2000
			}).present();
			return;
		}
		if(dish.editCount<=0){
			this.toastCtrl.create({
				message: '请输入菜品数量！',
				position: 'middle',
				duration: 2000
			}).present();
			return;
		}
		//添加备注
		this.service.EditMenuDish(dish.rid,dish.editPrice,dish.editCount).then(res=>{
			if(res.status==1){
				let oriTotalMoney=parseFloat(dish.dishes_price)*parseInt(dish.dishes_count);
				let totalMoney=parseFloat(dish.editPrice)*parseInt(dish.editCount);
				this.curMenuTotalMoney=this.curMenuTotalMoney-oriTotalMoney+totalMoney;
				for (let index = 0; index < this.dishTypeList.length; index++) {
					const element = this.dishTypeList[index];
					if(element.id==dish.service_type){
						element.count=element.count-parseInt(dish.dishes_count)+parseInt(dish.editCount);
						break;
					}
				}
				this.dishTypeList[0].count=this.dishTypeList[0].count-parseInt(dish.dishes_count)+parseInt(dish.editCount);
				dish.dishes_price=dish.editPrice;
				dish.dishes_count=dish.editCount;
				this.CancelEditMenuDish(dish);
			}
			else{
				this.toastCtrl.create({
					message: '编辑失败！',
					position: 'middle',
					duration: 2000
				}).present();
			}
		})
	}
	//删除菜单菜品
	DelMenuDish(dish,index){
		this.service.DelMenuDish(dish.rid).then(res=>{
			if(res.status==1){
				let oriTotalMoney=parseFloat(dish.dishes_price)*parseInt(dish.dishes_count);
				this.curMenuTotalMoney-=oriTotalMoney;
				for (let index = 0; index < this.dishTypeList.length; index++) {
					const element = this.dishTypeList[index];
					if(element.id==dish.service_type){
						element.count-=parseInt(dish.dishes_count);
						if (element.count==0) {
							this.dishTypeList.splice(index,1);
						}
						break;
					}
				}
				this.dishTypeList[0].count-=parseInt(dish.dishes_count);
				for (let inx = 0; inx < this.accountDishList.length; inx++) {
					const accountDish = this.accountDishList[inx];
					if(dish.id==accountDish.id){
						accountDish.choosed=false;
						this.DelByContent=true;
						break;
					}
				}
				this.dishList.splice(index,1);
			}
			else{
				this.toastCtrl.create({
					message: '删除失败！',
					position: 'middle',
					duration: 2000
				}).present();
			}
		})
	}

	//打开新增菜品弹窗
	OpenAddDishModal(){
		this.addOrEditDishModal=true;
		this.addOrEditDish.id=0;
		this.addOrEditDish.img="";
		this.addOrEditDish.dishType=null;
		this.addOrEditDish.name="";
		this.addOrEditDish.price=null;
		this.addOrEditDish.cost=null;
		this.addOrEditDish.unit="";
		this.addOrEditDish.description="";
		this.addOrEditDishModal=true;
	}
	//打开编辑菜品弹窗
	OpenEditDishModal(dish){
		this.curEditDish=dish;
		this.addOrEditDish.id=dish.id;
		this.addOrEditDish.img=dish.ref_pic_url;
		this.addOrEditDish.dishType=dish.service_type;
		this.addOrEditDish.name=dish.product_name;
		this.addOrEditDish.price=dish.price;
		this.addOrEditDish.cost=dish.cost;
		this.addOrEditDish.unit=dish.unit;
		this.addOrEditDish.description=dish.description;
		this.addOrEditDishModal=true;
	}
	//关闭新增菜品弹窗
	CloseAddOrEditDishModal(){
		this.addOrEditDishModal=false;
	}
	//新增/编辑菜品确认
	AddOrEditDishConfirm(form){
		if(this.addOrEditDish.img==""){
			this.toastCtrl.create({
				message: '请上传产品图片！',
				position: 'middle',
				duration: 2000
			}).present();
			return;
		}
		if (this.addOrEditDish.id==0) {
			this.service.AddDish(this.addOrEditDish.dishType,this.addOrEditDish.name,this.addOrEditDish.price,this.addOrEditDish.cost,this.addOrEditDish.unit,this.addOrEditDish.description,this.addOrEditDish.img).then(res=>{
				if(res.status==1){
					if (this.curAccountDishType.id==this.addOrEditDish.dishType||this.curAccountDishType.id==0) {
						this.accountDishList.push({
							id:res.productId,
							ref_pic_url:res.img,
							service_type:this.addOrEditDish.dishType,
							product_name:this.addOrEditDish.name,
							price:this.addOrEditDish.price,
							cost:this.addOrEditDish.cost,
							unit:this.addOrEditDish.unit,
							description:this.addOrEditDish.description
						});
					}
					this.toastCtrl.create({
						message: '添加成功！',
						position: 'middle',
						duration: 2000
					}).present();
					this.CloseAddOrEditDishModal();
				}
				else{
					this.toastCtrl.create({
						message: '添加失败！',
						position: 'middle',
						duration: 2000
					}).present();
				}
			})
		}
		else{
			this.service.EditDish(this.addOrEditDish.id,this.addOrEditDish.dishType,this.addOrEditDish.name,this.addOrEditDish.price,this.addOrEditDish.cost,this.addOrEditDish.unit,this.addOrEditDish.description,this.addOrEditDish.img).then(res=>{
				if(res.status==1){
					this.curEditDish.ref_pic_url=res.img;
					if (this.curEditDish.service_type!=this.addOrEditDish.dishType) {
						for (let inx = 0; inx < this.accountDishList.length; inx++) {
							const accountDish = this.accountDishList[inx];
							if (accountDish.id==this.curEditDish.id) {
								this.accountDishList.splice(inx,1);
								this.curEditDish.service_type=this.addOrEditDish.dishType;
							}
						}
					}
					else{
						this.curEditDish.product_name=this.addOrEditDish.name;
						this.curEditDish.price=this.addOrEditDish.price;
						this.curEditDish.cost=this.addOrEditDish.cost;
						this.curEditDish.unit=this.addOrEditDish.unit;
						this.curEditDish.description=this.addOrEditDish.description;
					}
					for (let index = 0; index < this.dishList.length; index++) {
						const dish = this.dishList[index];
						if(dish.id==this.curEditDish.id){
							dish.ref_pic_url=res.img;
							if(dish.service_type!=this.addOrEditDish.dishType){
								this.GetDishTypesDishNum();
							}
							else{
								dish.product_name=this.addOrEditDish.name;
								dish.price=this.addOrEditDish.price;
								dish.cost=this.addOrEditDish.cost;
								dish.unit=this.addOrEditDish.unit;
								dish.description=this.addOrEditDish.description;
							}
							break;
						}
					}
					this.toastCtrl.create({
						message: '编辑成功！',
						position: 'middle',
						duration: 2000
					}).present();
					this.CloseAddOrEditDishModal();
				}
				else{
					this.toastCtrl.create({
						message: '编辑失败！',
						position: 'middle',
						duration: 2000
					}).present();
				}
			})
		}
	}
	//新增/编辑菜品上传图片
	public AddOrEditDishUploadImg(data) {
		this.addOrEditDish.img = data;
	}
	//删除菜单
	DelMenu() {
		this.alertCtrl.create({
			title: '确定删除当前菜单?',
			// subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
			buttons: [
				{
					text: '确定',
					handler: data => {
						this.service.DelDishesMenu(this.curMenu.id).then(res=>{
							if (res.status==1) {
								this.navCtrl.pop();
							}
							else{
								this.toastCtrl.create({
									message: '删除失败！',
									position: 'middle',
									duration: 1000
								}).present();
							}
						})
					}
				},
				{
					text:"取消"
				}
			]
		}).present();
	}
	//增减菜单菜品
	ChooseDish(dish){
		if(this.DelByContent==true){
			this.DelByContent=false;
			return;
		}
		if(dish.choosed==undefined||dish.choosed==false){
			this.service.AddMenuDish(this.curMenu.id,dish.id,dish.price,1).then(res=>{
				if (res.status==1) {
					dish.choosed=true;
					dish.rid=res.rid;
					this.GetDishTypesDishNum();
				}
				else if (res.status==2) {
					this.toastCtrl.create({
						message: '该菜品不存在！',
						position: 'middle',
						duration: 2000
					}).present();
				}
				else{
					this.toastCtrl.create({
						message: '添加菜品失败！',
						position: 'middle',
						duration: 2000
					}).present();
				}
			})
		}
		else{
			this.alertCtrl.create({
				title: '确定从菜单移除该菜品?',
				buttons: [
					{
						text: '确定',
						handler: data => {
							this.service.DelMenuDish(dish.rid).then(res=>{
								if (res.status==1) {
									this.GetDishTypesDishNum();
									dish.choosed=false;
								}else{
									this.toastCtrl.create({
										message: '移除菜品失败！',
										position: 'middle',
										duration: 2000
									}).present();
								}
							})
						}
					},
					{
						text:"取消"
					}
				]
			}).present();
		}
	}
}
