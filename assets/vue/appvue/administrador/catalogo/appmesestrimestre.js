var this_js_script = $("script[src*=appmesestrimestre]");
var my_var_1 = this_js_script.attr("data-my_var_1");
if (typeof my_var_1 === "undefined") {
	var my_var_1 = "some_default_value";
}
var my_var_2 = this_js_script.attr("data-my_var_2");
if (typeof my_var_2 === "undefined") {
	var my_var_2 = "some_default_value";
}

Vue.config.devtools = true;
var vu = new Vue({
	el: "#appmeses",
	data: {
		url: my_var_1,
		idunidad: my_var_2,
		addModal: false,
		editModal: false,
		cargando: false,
		error: false,
		unidadmeses: [],
		meses: [],
		search: {
			text: ""
		},
		emptyResult: false,
		newMes: {
			idunidad: my_var_2,
			nombremes: "",
			fechainicio: "",
			fechafin: "",
			smserror: ""
		},
		chooseMes: {},
		formValidate: [],
		successMSG: "",

		//pagination
		currentPage: 0,
		rowCountPage: 10,
		totalMeses: 0,
		pageRange: 2,
		directives: {
			columnSortable
		}
	},
	created() {
		this.showAll();
		this.showAllMeses();
	},
	methods: {
		orderBy(sortFn) {
			// sort e array data like this.userArray
			this.unidadmeses.sort(sortFn);
		},
		abrirAddModal() {
			$("#addRegister").modal("show");
		},
		abrirEditModal() {
			$("#editRegister").modal("show");
		},
		showAll() {
			axios.get(this.url + "Examen/shoAllMesesUnidad/" + this.idunidad).then(function(response) {
				if (response.data.unidadmeses == null) {
					vu.noResult();
				} else {
					vu.getData(response.data.unidadmeses);
				}
			});
		},
		showAllMeses() {
			axios.get(this.url + "Examen/showAllMeses/").then(response => (this.meses = response.data.meses));
		},
		searchUnidad() {
			/*var formData = vu.formData(vu.search);
																						  axios.post(this.url + "Examen/searchUnidadExamen", formData).then(function (response) {
																							if (response.data.unidades == null) {
																							  vu.noResult();
																							} else {
																							  vu.getData(response.data.unidades);
																							}
																						  });*/
		},
		addMesUnidad() {
			vu.cargando = true;
			vu.error = false;
			var formData = vu.formData(vu.newMes);
			axios.post(this.url + "Examen/addMesUnidad", formData).then(function(response) {
				if (response.data.error) {
					vu.formValidate = response.data.msg;
					vu.error = true;
					vu.cargando = false;
				} else {
					swal({ position: "center", type: "success", title: "Exito!", showConfirmButton: false, timer: 1500 });

					vu.clearAll();
					vu.clearMSG();
				}
			});
		},
		updateMesUnidad() {
			vu.cargando = true;
			vu.error = false;
			var formData = vu.formData(vu.chooseMes);
			axios.post(this.url + "Examen/updateMesUnidad", formData).then(function(response) {
				if (response.data.error) {
					vu.formValidate = response.data.msg;
					vu.error = true;
					vu.cargando = false;
				} else {
					//vu.successMSG = response.data.success;
					swal({ position: "center", type: "success", title: "Modificado!", showConfirmButton: false, timer: 1500 });
					vu.clearAll();
					vu.clearMSG();
				}
			});
		},
		deleteUnidadMes(id) {
			console.log(id);
			Swal.fire({
				title: "¿Eliminar Mes?",
				text: "Realmente desea eliminar el Mes.",
				type: "question",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Eliminar",
				cancelButtonText: "Cancelar"
			}).then(result => {
				if (result.value) {
					axios.get(this.url + "Examen/deleteUnidadMes", {
						params: {
							id: id
						}
					}).then(function(response) {
						if (response.data.error == false) {
							swal({ position: "center", type: "success", title: "Eliminado!", showConfirmButton: false, timer: 3000 });
							vu.clearAll();
							vu.clearMSG();
						} else {
							swal("Información", response.data.msg.msgerror, "info");
						}
					}).catch(error => {
						swal("Información", "No se puede eliminar el Examen", "info");
					});
				}
			});
		},
		formData(obj) {
			var formData = new FormData();
			for (var key in obj) {
				formData.append(key, obj[key]);
			}
			return formData;
		},
		getData(unidadmeses) {
			vu.emptyResult = false; // become false if has a record
			vu.totalMeses = unidadmeses.length; //get total of user
			vu.unidadmeses = unidadmeses.slice(vu.currentPage * vu.rowCountPage, vu.currentPage * vu.rowCountPage + vu.rowCountPage); //slice the result for pagination

			// if the record is empty, go back a page
			if (vu.unidadmeses.length == 0 && vu.currentPage > 0) {
				vu.pageUpdate(vu.currentPage - 1);
				vu.clearAll();
			}
		},

		selectUnidadMes(unidad) {
			vu.chooseMes = unidad;
		},
		clearMSG() {
			setTimeout(function() {
				vu.successMSG = "";
			}, 3000); // disappearing message success in 2 sec
		},
		clearAll() {
			vu.cargando = false;
			vu.error = false;
			$("#editRegister").modal("hide");
			$("#addRegister").modal("hide");
			vu.newMes = {
				idunidad: my_var_2,
				nombremes: "",
				fechainicio: "",
				fechafin: "",
				smserror: ""
			};
			vu.formValidate = false;
			vu.refresh();
		},
		noResult() {
			vu.emptyResult = true; // become true if the record is empty, print 'No Record Found'
			vu.unidadmeses = null;
			vu.totalMeses = 0; //remove current page if is empty
		},

		pageUpdate(pageNumber) {
			vu.currentPage = pageNumber; //receive currentPage number came from pagination template
			vu.refresh();
		},
		refresh() {
			vu.search.text
				? vu.searchUnidad()
				: vu.showAll(); //for preventing
		}
	}
});
