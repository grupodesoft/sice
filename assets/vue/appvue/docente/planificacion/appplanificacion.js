
var this_js_script = $('script[src*=appplanificacion]');
var my_var_1 = this_js_script.attr('data-my_var_1');
if (typeof my_var_1 === "undefined") {
    var my_var_1 = 'some_default_value';
}


Vue.config.devtools = true;  
Vue.use( CKEditor );
var vu = new Vue({
    el: '#appplanificacion',   
    data: {
           editor: ClassicEditor,
        editorData: '<p>Content of the editor.</p>',
        editorConfig: {
            // The configuration of the editor.
        },
        url: my_var_1,
        addModal: false,
        editModal: false,
        cargando: false,
        error: false,
        planificaciones: [],
        grupos: [],
        search: {text: ''},
        emptyResult: false,
       
        newPlanificacion: {
            idperiodo: '',
            idprofesor: '',
            idgrupo: '', 
            bloque: '',
            fechaejecucion: '',
            valordelmes: '',
            practicasociallenguaje: '',
            enfoque: '',
            ambito: '',
            competenciafavorece: '',
            tipotext: '',
            aprendizajeesperado: '',
            propositodelproyecto: '',
            produccionesdesarrolloproyecto: '',
            recursosdidacticos: '',
            indicadoresevaluacion: '',
            observacionesdocente: '',
            observacionescoordinador: '',
            smserror: ''
        },
        choosePlanificacion: {},
        formValidate: [],
        successMSG: '',

        //pagination
        currentPage: 0,
        rowCountPage: 10,
        totalPlanificaciones: 0,
        pageRange: 2,
        directives: {columnSortable}
    },
    created() {
        this.showAll();
        this.showAllGrupos();
    },
    methods: {
        orderBy(sortFn) {
            // sort e array data like this.userArray
            this.planificaciones.sort(sortFn);
        },
        abrirAddModal() {
            $("#addRegister").modal("show");
        },
        abrirEditModal() {
            $("#editRegister").modal("show");
        },
        showAll() {
            axios.get(this.url + "Planificacion/showAll").then(function (response) {
                if (response.data.planificaciones == null) {
                    vu.noResult()
                } else {
                    vu.getData(response.data.planificaciones);
                }
            })
        },
          showAllGrupos() {
            axios.get(this.url + "Planificacion/showAllGrupos/")
                    .then(
                            (response) => (this.grupos = response.data.grupos)
                    );
        },
        searcPlanificacion() {
            var formData = vu.formData(vu.search);
            axios.post(this.url + "Planificacion/searchPlanificacion", formData).then(function (response) {
                if (response.data.planificaciones == null) {
                    vu.noResult()
                } else {
                    vu.getData(response.data.planificaciones);

                }
            })
        },
        addPlanificacion() { 
            vu.cargando = true;
            vu.error = false;
            var formData = vu.formData(vu.newPlanificacion);
            axios.post(this.url + "Planificacion/addPlanificacion", formData).then(function (response) {
                if (response.data.error) {
                    vu.formValidate = response.data.msg;
                    vu.error = true;
                    vu.cargando = false;
                } else {
                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Registrado!',
                        showConfirmButton: false,
                        timer: 1500
                    });

                    vu.clearAll();
                    vu.clearMSG();
                }
            })
        },
        updatePlanificacion() {
            vu.cargando = true;
            vu.error = false;
            var formData = vu.formData(vu.choosePlanificacion);
            axios.post(this.url + "Planificacion/editPlanificacion", formData).then(function (response) {
                if (response.data.error) {
                    vu.formValidate = response.data.msg;
                    vu.error = true;
                    vu.cargando = false;
                } else {
                    //vu.successMSG = response.data.success;
                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Modificado!',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    vu.clearAll();
                    vu.clearMSG();

                }
            })
        },
        deletePlanificacion(id) {
            Swal.fire({
                title: '¿Eliminar Planificación?',
                text: "Realmente desea eliminar la Planificación.",
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {

                    axios.get(this.url + "Planificacion/deletePlanificacion", {
                        params: {
                            id: id
                        }
                    }).then(function (response) {
                        if (response.data.error == false) {
                            swal({
                                position: 'center',
                                type: 'success',
                                title: 'Eliminado!',
                                showConfirmButton: false,
                                timer: 3000
                            });
                            vu.clearAll();
                            vu.clearMSG();
                        } else {
                            swal("Información", response.data.msg.msgerror, "info")
                        }
                    }).catch((error) => {
                        swal("Información", "No se puede eliminar el Examen", "info")
                    })
                }
            })
        },
        formData(obj) {
            var formData = new FormData();
            for (var key in obj) {
                formData.append(key, obj[key]);
            }
            return formData;
        },
        getData(planificaciones) {
            vu.emptyResult = false; // become false if has a record
            vu.totalOportunidades = planificaciones.length; //get total of user
            vu.planificaciones = planificaciones.slice(vu.currentPage * vu.rowCountPage, (vu.currentPage * vu.rowCountPage) + vu.rowCountPage); //slice the result for pagination

            // if the record is empty, go back a page
            if (vu.planificaciones.length == 0 && vu.currentPage > 0) {
                vu.pageUpdate(vu.currentPage - 1)
                vu.clearAll();
            }
        },

        selectPlanificacion(planificacion) {
            vu.choosePlanificacion = planificacion;
        },
        clearMSG() {
            setTimeout(function () {
                vu.successMSG = ''
            }, 3000); // disappearing message success in 2 sec
        },
        clearAll() {
            vu.cargando = false;
            vu.error = false;
            $("#editRegister").modal("hide");
            $("#addRegister").modal("hide");
            vu.newPlanificacion = {
                idperiodo: '',
                idprofesor: '',
                idgrupo: '',
                bloque: '',
                fechaejecucion: '',
                valordelmes: '',
                practicasociallenguaje: '',
                enfoque: '',
                ambito: '',
                competenciafavorece: '',
                tipotext: '',
                aprendizajeesperado: '',
                propositodelproyecto: '',
                produccionesdesarrolloproyecto: '',
                recursosdidacticos: '',
                indicadoresevaluacion: '',
                observacionesdocente: '',
                observacionescoordinador: '',
                smserror: ''
            };
            vu.formValidate = false;
            vu.refresh();

        },
        noResult() {
            vu.emptyResult = true;  // become true if the record is empty, print 'No Record Found'
            vu.oportunidades = null;
            vu.totalOportunidades = 0; //remove current page if is empty 
        },

        pageUpdate(pageNumber) {
            vu.currentPage = pageNumber; //receive currentPage number came from pagination template
            vu.refresh();
        },
        refresh() {
            vu.search.text ? vu.searchOportunidad() : vu.showAll(); //for preventing

        }
    }
})
