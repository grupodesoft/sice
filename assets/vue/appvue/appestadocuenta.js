
var this_js_script = $('script[src*=appestadocuenta]');
var my_var_1 = this_js_script.attr('data-my_var_1'); 
if (typeof my_var_1 === "undefined") {
    var my_var_1 = 'some_default_value';
} 
var my_var_2 = this_js_script.attr('data-my_var_2'); 
if (typeof my_var_2 === "undefined") {
    var my_var_2 = 'some_default_value';
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
var ve = new Vue({
   el:'#appestadocuenta',
    data:{
        url: my_var_1,
        idalumno: my_var_2,
        addModal: false,
        addPagoModal: false,
        editModal:false,
        mostrar:false,
        noresultado:false,
        noresultadoinicio:false,
        btnpagar:false,
        //deleteModal:false, 
        ciclos:[],
        pagos:[],
        formaspago:[],
        solicitudes:[], 
        search: {text: ''},
        emptyResult:false,
        newBuscarCiclo:{
            idalumno:my_var_2,
            idperiodo:'',
            msgerror:''},
        newCobroInicio:{
            idalumno:my_var_2, 
            descuento:'',
            autorizacion:'',
            idformapago:'', 
        },
        newCobro:{ 
            idformapago:'', 
            autorizacion:'',
            idperiodo:'',
            idalumno:my_var_2,
            idamortizacion:'', 
            msgerror:''},
        chooseSolicitud:{},
        choosePeriodo:{},
        formValidate:[],
        idperiodobuscado:'',
        successMSG:'', 
    },
     created(){ 
      this.showAllTutoresDisponibles();
      this.showAllFormasPago(); 
    },
    methods:{
      searchSolicitud() { 
             this.mostrar = true; 
             axios.get(this.url+"EstadoCuenta/estadoCuenta/", {
                 params: {
                     idperiodo: this.$refs.idperiodo.value,
                     idalumno: my_var_2
                 }
             }).then(function(response){
                //console.log(response.data);
                 if(response.data == ''){
                      ve.solicitudes = null;
                      ve.noresultado = true;
                    }else{
                        ve.solicitudes = response.data
                         ve.noresultado = false;
                    }
            });

            axios.get(this.url+"EstadoCuenta/pagosInicio/", {
                 params: {
                     idperiodo: this.$refs.idperiodo.value,
                     idalumno: my_var_2
                 }
             }).then(function(response){
                //console.log(response.data);
                 if(response.data == null){
                      ve.pagos = null;
                      ve.noresultadoinicio = true;
                      ve.btnpagar = true;
                    }else{
                      console.log(response.data);
                        ve.pagos = response.data
                         ve.noresultadoinicio = false;
                         ve.btnpagar = false;
                    }
            });
             ve.idperiodobuscado = this.$refs.idperiodo.value;
          //then(response => (this.solicitudes = response.data))  

         },
         estadocuentaAll(idperiodo){
             axios.get(this.url+"EstadoCuenta/estadoCuenta/", {
                 params: {
                     idperiodo: idperiodo,
                     idalumno: my_var_2
                 }
             }).then(response => (this.solicitudes = response.data)) 
         },
        showAllTutoresDisponibles() {

            axios.get(this.url+"EstadoCuenta/showAllCicloEscolar/")
                    .then(response => (this.ciclos = response.data.ciclos));

        },
        showAllFormasPago() {

            axios.get(this.url+"EstadoCuenta/showAllFormasPago/")
                    .then(response => (this.formaspago = response.data.formaspago));

        },
        selectPeriodo(solicitud) {
             ve.chooseSolicitud = solicitud; 

         },
        formData(obj){
            var formData = new FormData();
              for ( var key in obj ) {
                  formData.append(key, obj[key]);
              }
              return formData;
        },
      addCobro(){
            var formData = v.formData(ve.newCobro);
                formData.append('abono', ve.chooseSolicitud.descuento);
                formData.append('idamortizacion', ve.chooseSolicitud.idamortizacion);
            // for (var value of formData.values()) {
            //                  console.log(value); 
            //               }
              axios.post(this.url+"EstadoCuenta/addCobro", formData).then(function(response){
                if(response.data.error){
                    ve.formValidate = response.data.msg;
                }else{
                    swal({
                      position: 'center',
                      type: 'success',
                      title: 'Exito!',
                      showConfirmButton: false,
                      timer: 1500
                    });

                    ve.clearAll(); 
                    ve.estadocuentaAll(ve.chooseSolicitud.idperiodo);
                }
               })
        },
            addCobroInicio(){
            var formData = v.formData(ve.newCobroInicio); 
                formData.append('idperiodobuscado', ve.idperiodobuscado);
            // for (var value of formData.values()) {
            //                  console.log(value); 
            //               }
              axios.post(this.url+"EstadoCuenta/addCobroInicio", formData).then(function(response){
                if(response.data.error){
                    ve.formValidate = response.data.msg;
                }else{
                    swal({
                      position: 'center',
                      type: 'success',
                      title: 'Exito!',
                      showConfirmButton: false,
                      timer: 1500
                    });

                    ve.clearAll(); 
                    ve.estadocuentaAll(ve.chooseSolicitud.idperiodo);
                }
               })
        },
        clearAll(){ 
            ve.formValidate = false;
            ve.addModal= false; 
            ve.addPagoModal = false;

        },
    }
});