
var this_js_script = $('script[src*=apptutor]');
var my_var_1 = this_js_script.attr('data-my_var_1');
if (typeof my_var_1 === "undefined") {
    var my_var_1 = 'some_default_value';
}


Vue.config.devtools = true
var v = new Vue({
    el: '#app',
    data: {
        url: my_var_1,
        addModal: false,
        editModal: false,
        editPasswordModal: false,
        cargando: false,
        error: false,
        url_image: my_var_1 + '/assets/tutores/',
        tutores: [],
        search: {text: ''},
        emptyResult: false,
        newTutor: {
            nombre: '',
            apellidop: '',
            apellidom: '',
            ocupacion: '',
            escolaridad: '',
            dondetrabaja: '',
            fnacimiento: '',
            direccion: '',
            telefono: '',
            correo: '',
            password: '',
            rfc: '',
            factura: '',
            smserror: ''},
        chooseTutor: {},
        formValidate: [],
        successMSG: '',

        //pagination
        currentPage: 0,
        rowCountPage: 10,
        totalTutores: 0,
        pageRange: 2,
        directives: {columnSortable}
    },
    created() {
        this.showAll();
    },
    methods: {
        orderBy(sortFn) {
            // sort your array data like this.userArray
            this.tutores.sort(sortFn);
        },
        abrirAddModal() {
            $('#addRegister').modal('show');
        },
        abrirEditModal() {
            $('#editRegister').modal('show');
        },
        abrirPasswordModal() {
            $('#changePassword').modal('show');
        },
        showAll() {
            axios.get(this.url + "Tutor/showAll").then(function (response) {
                if (response.data.tutores == null) {
                    v.noResult()
                } else {
                    v.getData(response.data.tutores);
                }
            })
        },
        searchTutor() {
            var formData = v.formData(v.search);
            axios.post(this.url + "Tutor/searchTutor", formData).then(function (response) {
                if (response.data.tutores == null) {
                    v.noResult()
                } else {
                    v.getData(response.data.tutores);

                }
            })
        },
        addTutor() {
            v.cargando = true;
            v.error = false;
            var formData = v.formData(v.newTutor);
            axios.post(this.url + "Tutor/addTutor", formData).then(function (response) {
                if (response.data.error) {
                    v.formValidate = response.data.msg;
                    v.error = true;
                    v.cargando = false;
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
        deleteTutor(id) {
            Swal.fire({
                title: '¿Eliminar Tutor?',
                text: "Realmente desea eliminar el Tutor.",
                type: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Eliminar',
                cancelButtonText: 'Cancelar'
            }).then((result) => {
                if (result.value) {

                    axios.get(this.url + "Tutor/deleteTutor", {
                        params: {
                            idtutor: id
                        }
                    }).then(function (response) {
                        if (response.data.error == false) {
                            //v.noResult()
                            swal({
                                position: 'center',
                                type: 'success',
                                title: 'Eliminado!',
                                showConfirmButton: false,
                                timer: 3000
                            });
                            v.clearAll();
                            v.clearMSG();
                        } else {
                            swal("Información", response.data.msg.msgerror, "info")
                        }
                    }).catch((error) => {
                        swal("Información", "No se puede eliminar.", "info")
                    })
                }
            })
        },
        updateTutor() {
            v.cargando = true;
            v.error = false;
            var formData = v.formData(v.chooseTutor);
            axios.post(this.url + "Tutor/updateTutor", formData).then(function (response) {
                if (response.data.error) {
                    v.formValidate = response.data.msg;
                    v.error = true;
                    v.cargando = false;
                } else {
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
        updatePassword() {
            v.error = false;
            v.cargando = true;
            var formData = v.formData(v.chooseTutor);
            axios.post(this.url + "Tutor/updatePassword", formData).then(function (response) {
                if (response.data.error) {
                    v.formValidate = response.data.msg;
                    v.error = true;
                    v.cargando = false;
                } else {
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
        formData(obj) {
            var formData = new FormData();
            for (var key in obj) {
                formData.append(key, obj[key]);
            }
            return formData;
        },
        getData(tutores) {
            v.emptyResult = false; // become false if has a record
            v.totalTutores = tutores.length //get total of user
            v.tutores = tutores.slice(v.currentPage * v.rowCountPage, (v.currentPage * v.rowCountPage) + v.rowCountPage); //slice the result for pagination

            // if the record is empty, go back a page
            if (v.tutores.length == 0 && v.currentPage > 0) {
                v.pageUpdate(v.currentPage - 1)
                v.clearAll();
            }
        },

        selectTutor(tutor) {
            v.chooseTutor = tutor;
        },
        clearMSG() {
            setTimeout(function () {
                v.successMSG = ''
            }, 3000); // disappearing message success in 2 sec
        },
        clearAll() {
            $('#addRegister').modal('hide');
            $('#editRegister').modal('hide');
            $('#changePassword').modal('hide');
            v.newTutor = {
                nombre: '',
                apellidop: '',
                apellidom: '',
                fnacimiento: '',
                direccion: '',
                telefono: '',
                correo: '',
                password: '',
                rfc: '',
                factura: '',
                smserror: ''};
            v.formValidate = false;
            v.addModal = false;
            v.editPasswordModal = false;
            v.editModal = false;
            v.passwordModal = false;
            v.deleteModal = false;
            v.cargando = false;
            v.error = false;
            v.refresh();

        },
        noResult() {

            v.emptyResult = true;  // become true if the record is empty, print 'No Record Found'
            v.tutores = null;
            v.totalTutores = 0; //remove current page if is empty

        },

        pageUpdate(pageNumber) {
            v.currentPage = pageNumber; //receive currentPage number came from pagination template
            v.refresh();
        },
        refresh() {
            v.search.text ? v.searchTutor() : v.showAll(); //for preventing

        }
    }
})
