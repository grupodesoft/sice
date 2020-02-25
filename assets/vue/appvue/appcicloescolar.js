
var this_js_script = $('script[src*=appcicloescolar]');
var my_var_1 = this_js_script.attr('data-my_var_1'); 
if (typeof my_var_1 === "undefined") {
    var my_var_1 = 'some_default_value';
} 


Vue.config.devtools = true
Vue.component('modal',{ //modal
    template:`
   <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog">
			    <div class="modal-content">


			      <div class="modal-header">
				        <h5 class="modal-title"> <slot name="head"></slot></h5>
				       <i class="fa fa-window-close  icon-md text-danger" @click="$emit('close')"></i>
				      </div>

			      <div class="modal-body" style="background-color:#fff;">
			         <slot name="body"></slot>
			      </div>
			      <div class="modal-footer">

			         <slot name="foot"></slot>
			      </div>
			    </div>
          </div>
        </div>
      </div>
    </transition>
    `
})
var v = new Vue({
   el:'#app',
    data:{
        url: my_var_1,
        addModal: false,
        editModal:false, 
        //deleteModal:false,
        ciclos:[], 
        meses:[], 
        years:[], 
        search: {text: ''},
        emptyResult:false,
        newCiclo:{
            idmesinicio:'',
            idyearinicio:'',
            idmesfin:'',
            idyearfin:'', 
            activo:'',
            smserror:''},
        chooseCiclo:{},
        formValidate:[],
        successMSG:'',

        //pagination
        currentPage: 0,
        rowCountPage:10,
        totalCiclos:0,
        pageRange:2,
         directives: {columnSortable}
    },
     created(){
      this.showAll();
      this.showAllMeses();
      this.showAllYears(); 
    },
    methods:{
         orderBy(sortFn) {
            // sort your array data like this.userArray
            this.ciclos.sort(sortFn);
        },
         showAll(){ axios.get(this.url+"CicloEscolar/showAll").then(function(response){
                 if(response.data.ciclos == null){
                     v.noResult()
                    }else{
                        v.getData(response.data.ciclos);
                    }
            })
        }, 
         showAllMeses(){ 
          axios.get(this.url+"CicloEscolar/showAllMeses/")
                    .then(response => (this.meses = response.data.meses));

        }, 
         showAllYears(){ 
          axios.get(this.url+"CicloEscolar/showAllYears/")
                    .then(response => (this.years = response.data.years));

        }, 
          searchCiclo(){
            var formData = v.formData(v.search);
              axios.post(this.url+"CicloEscolar/searchCiclo", formData).then(function(response){
                  if(response.data.ciclos == null){
                      v.noResult()
                    }else{
                      v.getData(response.data.ciclos);

                    }
            })
        },
          addCiclo(){
            var formData = v.formData(v.newCiclo);
              axios.post(this.url+"CicloEscolar/addCiclo", formData).then(function(response){
                if(response.data.error){
                    v.formValidate = response.data.msg;
                }else{
                    swal({
					  position: 'center',
					  type: 'success',
					  title: 'Exito!',
					  showConfirmButton: false,
					  timer: 1500
					});

                    v.clearAll();
                    v.clearMSG();
                }
               })
        },
        updateCiclo(){
            var formData = v.formData(v.chooseCiclo); axios.post(this.url+"CicloEscolar/updateCiclo", formData).then(function(response){
                if(response.data.error){
                    v.formValidate = response.data.msg;
                    console.log(response.data.error)
                }else{
                    //v.successMSG = response.data.success;
                      swal({
                            position: 'center',
                            type: 'success',
                            title: 'Modificado!',
                            showConfirmButton: false,
                            timer: 1500
                          });
                    v.clearAll();
                    v.clearMSG();

                }
            })
        },
         deleteCicloEscolar(id){
            Swal.fire({
          title: '¿Eliminar Ciclo Escolar?',
          text: "Realmente desea eliminar el Ciclo Escolar.",
          type: 'info',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Eliminar',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.value) {

              axios.get(this.url + "CicloEscolar/deleteCicloEscolar", {
                params: {
                    idperiodo: id
                }
            }).then(function (response) {
                if (response.data.ciclos == true) {
                    //v.noResult()
                     swal({
                        position: 'center',
                        type: 'success',
                        title: 'Eliminado!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    v.clearAll();
                    v.clearMSG();
                } else {
                   swal("Error", "No se puede eliminar el Ciclo Escolar", "error")
                }
                console.log(response);
            }).catch((error) => {
                swal("Error", "No se puede eliminar el Ciclo Escolar", "error")
            })
            }
            })
        },
         formData(obj){
			var formData = new FormData();
		      for ( var key in obj ) {
		          formData.append(key, obj[key]);
		      }
		      return formData;
		},
        getData(ciclos){
            v.emptyResult = false; // become false if has a record
            v.totalCiclos = ciclos.length //get total of user
            v.ciclos = ciclos.slice(v.currentPage * v.rowCountPage, (v.currentPage * v.rowCountPage) + v.rowCountPage); //slice the result for pagination

             // if the record is empty, go back a page
            if(v.ciclos.length == 0 && v.currentPage > 0){
            v.pageUpdate(v.currentPage - 1)
            v.clearAll();
            }
        },

        selectCiclo(ciclo){
            v.chooseCiclo = ciclo;
            //console.log(alumno);
        },
        clearMSG(){
            setTimeout(function(){
			 v.successMSG=''
			 },3000); // disappearing message success in 2 sec
        },
        clearAll(){
            v.newCiclo = {
            idmesinicio:'',
            idyearinicio:'',
            idmesfin:'',
            idyearfin:'', 
            activo:'',
            smserror:''};
            v.formValidate = false;
            v.addModal= false; 
            v.editModal=false;
            //v.passwordModal=false;
            //v.deleteModal=false;
            v.refresh()

        },
        noResult(){

               v.emptyResult = true;  // become true if the record is empty, print 'No Record Found'
                      v.ciclos = null
                     v.totalCiclos = 0 //remove current page if is empty

        },


        pageUpdate(pageNumber){
              v.currentPage = pageNumber; //receive currentPage number came from pagination template
                v.refresh()
        },
        refresh(){
             v.search.text ? v.searchAlumno() : v.showAll(); //for preventing

        }
    }
})