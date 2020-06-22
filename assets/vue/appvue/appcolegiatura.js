
var this_js_script = $('script[src*=appcolegiatura]');
var my_var_1 = this_js_script.attr('data-my_var_1');
if (typeof my_var_1 === "undefined") {
    var my_var_1 = 'some_default_value';
}


Vue.config.devtools = true
Vue.component('modal', { //modal
    template: `
   <transition name="modal">
      <div class="modal-mask">
        <div class="modal-wrapper">
          <div class="modal-dialog">
			    <div class="modal-content">


			      <div class="modal-header">
				        <h5 class="modal-title"> <slot name="head"></slot></h5>
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
    el: '#app',
    data: {
        url: my_var_1,
        addModal: false,
        editModal: false,
        //deleteModal:false,
        cargando:false,
        error:false,
        colegiaturas: [],
        niveles: [],
        conceptos: [],
        search: { text: '' },
        emptyResult: false,
        newColegiatura: {
            idnivel: '',
            idconcepto:'',
            descuento: '',
            activo: ''
        },
        chooseColegiatura: {},
        formValidate: [],
        successMSG: '',

        //pagination
        currentPage: 0,
        rowCountPage: 10,
        totalColegiaturas: 0,
        pageRange: 2,
        directives: { columnSortable }
    },
    created() {
        this.showAll();
        this.showAllNiveles();
        this.showAllConceptos();
    },
    methods: {
        orderBy(sortFn) {
            // sort e array data like this.userArray
            this.colegiaturas.sort(sortFn);
        },
        showAll() {
            axios.get(this.url + "Catalogo/showAll").then(function (response) {
                if (response.data.colegiaturas == null) {
                    v.noResult()
                } else {
                    v.getData(response.data.colegiaturas);
                }
            })
        },
        showAllNiveles() {
            axios.get(this.url + "Catalogo/showAllNiveles/")
                .then(response => (this.niveles = response.data.niveles));

        }, 
        showAllConceptos() {
            axios.get(this.url + "Catalogo/showAllConceptos/")
                .then(response => (this.conceptos = response.data.conceptos));

        }, 
        searchColegiatura() {
            var formData = v.formData(v.search);
            axios.post(this.url + "Catalogo/searchColegiatura", formData).then(function (response) {
                if (response.data.colegiaturas == null || response.data.colegiaturas == false) {
                    v.noResult()
                } else {
                    v.getData(response.data.colegiaturas);

                }
            })
        },
        addColegiatura() {
            v.cargando = true;
            v.error = false;
            var formData = v.formData(v.newColegiatura);
            axios.post(this.url + "Catalogo/addColegiatura", formData).then(function (response) {
                if (response.data.error) {
                    v.formValidate = response.data.msg;
                    v.error = true;
                    v.cargando =false;
                } else {
                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Exito!',
                        showConfirmButton: false,
                        timer: 3000
                    });

                    v.clearAll();
                    v.clearMSG();
                }
            })
        },
        updateColegiatura() {
            v.cargando = true;
            v.error = false;
            var formData = v.formData(v.chooseColegiatura); axios.post(this.url + "Catalogo/updateColegiatura", formData).then(function (response) {
                if (response.data.error) {
                    v.formValidate = response.data.msg;
                    v.error = true;
                    v.cargando = false;
                    //console.log(response.data.error)
                } else {
                    //v.successMSG = response.data.success;
                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Modificado!',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    v.clearAll();
                    v.clearMSG();

                }
            })
        },
        deleteColegiatura(id) {
            // body...
            Swal.fire({
                title: '¿Eliminar Colegiatura?',
                text: "Realmente desea eliminar la Colegiatura.",
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {

                    axios.get(this.url + "Catalogo/deleteColegiatura", {
                        params: {
                            idcolegiatura: id
                        }
                    }).then(function (response) {
                        if (response.data.colegiaturas == true) {
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
                            swal("Información", "No se puede eliminar la Colegiatura", "info")
                        }
                        console.log(response);
                    }).catch((error) => {
                        swal("Información", "No se puede eliminar la Colegiatura", "info")
                    })
                }
            })
        },

        /* deleteUser(){
              var formData = v.formData(v.chooseUser);
               axios.post(this.url+"user/deleteUser", formData).then(function(response){
                 if(!response.data.error){
                      v.successMSG = response.data.success;
                     v.clearAll();
                     v.clearMSG();
                 }
             })
         },*/
        formData(obj) {
            var formData = new FormData();
            for (var key in obj) {
                formData.append(key, obj[key]);
            }
            return formData;
        },
        getData(colegiaturas) {
            v.emptyResult = false; // become false if has a record
            v.totalColegiaturas = colegiaturas.length //get total of user
            v.colegiaturas = colegiaturas.slice(v.currentPage * v.rowCountPage, (v.currentPage * v.rowCountPage) + v.rowCountPage); //slice the result for pagination

            // if the record is empty, go back a page
            if (v.colegiaturas.length == 0 && v.currentPage > 0) {
                v.pageUpdate(v.currentPage - 1)
                v.clearAll();
            }
        },

        selectColegiatura(colegiatura) {
            v.chooseColegiatura = colegiatura;
        },
        clearMSG() {
            setTimeout(function () {
                v.successMSG = ''
            }, 3000); // disappearing message success in 2 sec
        },
        clearAll() {
            v.newColegiatura = {
                idnivel: '',
                descuento: '',
                smserror: ''
            };
            v.formValidate = false;
            v.addModal = false;
            v.editModal = false;
            v.deleteModal = false;
            v.cargando = false;
            v.error = false;
            v.refresh()

        },
        noResult() {

            v.emptyResult = true;  // become true if the record is empty, print 'No Record Found'
            v.colegiaturas = null
            v.totalColegiaturas = 0 //remove current page if is empty

        },


        pageUpdate(pageNumber) {
            v.currentPage = pageNumber; //receive currentPage number came from pagination template
            v.refresh()
        },
        refresh() {
            v.search.text ? v.searchColegiatura() : v.showAll(); //for preventing

        }
    }
})
