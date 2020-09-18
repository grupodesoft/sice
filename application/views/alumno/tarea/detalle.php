<!-- page content -->
<style>
  .ck-editor__editable {
    min-height: 200px;
   }
</style>
<div class="right_col" role="main">
    <div class="">
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                    <div class="x_title">
                        <h2><strong><i class="fa fa-book"></i> DETALLE DE LA TAREA</strong></h2>

                        <div class="clearfix"></div>
                    </div>
                    <div class="x_content"> 
                        <div class="row"> 
                            <div id="appdetalletarea">
                                <div class="container">
                                    <div class="row"> 
                                        <div class="col-md-8  col-sm-12 col-xs-12">
                                            <h6>Titulo:</h6>
                                            <h5>{{tarea.titulo}}</h5>
                                        </div>
                                        <div class="col-md-4  col-sm-12 col-xs-12" align='right'>
                                            <h5>Entregar antes de: {{tarea.horaentrega}} {{tarea.fechaentrega}}</h5>

                                        </div>
                                    </div> 
                                    <div class="row">
                                        <div class="col-md-8  col-sm-12 col-xs-12">
                                            <h6>Tarea:</h6>
                                            <div v-html="tarea.tarea" ></div>
                                        </div>
                                        <div class="col-md-4  col-sm-12 col-xs-12" align='right'>
                                            <a v-if="tarea.iddocumento" v-bind:href="'https://drive.google.com/uc?export=download&id='+ tarea.iddocumento" target="_blank"><i class="fa fa-cloud-download"></i> DESCARGAR DOCUMENTO</a>
                                        </div>
                                    </div>
                                    <hr/>
                                    <div class="row" v-if="!contestado">
                                        <div class="col-md-8  col-sm-12 col-xs-12">
                                            <button type="button"   @click=" abrirAddModal()" class="btn btn-rounded btn-default btn-lg "> <i class="fa fa-pencil" ></i> ENTREGAR TAREA</button>
                                        </div>
                                    </div>
                                    <div  v-if="contestado">
                                        <div class="row">
                                               <div class="col-md-6  col-sm-12 col-xs-12" align="left">
                                                   <label  class="label bg-green" v-if="contestado.idestatustarea == 1" >ENVIADO</label>
                                                    <label  class="label bg-blue" v-if="contestado.idestatustarea != 1" >{{contestado.nombreestatus}}</label>
                                            </div>
                                            <div class="col-md-6  col-sm-12 col-xs-12" align="right">
                                                <small>{{contestado.fecharegistro}}</small>
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-8  col-sm-12 col-xs-12">
                                                <h6>Respuesta:</h6>
                                                <div v-html="contestado.mensaje" ></div>
                                            </div>
                                            <div class="col-md-4  col-sm-12 col-xs-12" align='right'>
                                                <a v-if="contestado.iddocumento" v-bind:href="'https://drive.google.com/uc?export=download&id='+ contestado.iddocumento" target="_blank"><i class="fa fa-cloud-download"></i> DOCUMENTO ENVIADO</a>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="contestado && contestado.observacionesdocente != ''">
                                    <hr>
                                    <div class="row">
                                        <div class="col-md-8  col-sm-12 col-xs-12">
                                            <h6>Observaciones del docente:</h6>
                                            <div v-html="contestado.observacionesdocente" ></div>
                                        </div> 
                                    </div>
                                    </div>
                                </div>
                                <?php include'modal.php'; ?>
                            </div>


                        </div> 
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- footer content -->
    <footer>
        <div class="copyright-info">
            <p class="pull-right">SICE - Sistema Integral para el Control Escolar</a>
            </p>
        </div>
        <div class="clearfix"></div>
    </footer>
    <!-- /footer content -->

</div>
<!-- /page content -->
</div>

</div>

<div id="custom_notifications" class="custom-notifications dsp_none">
    <ul class="list-unstyled notifications clearfix" data-tabbed_notifications="notif-group">
    </ul>
    <div class="clearfix"></div>
    <div id="notif-group" class="tabbed_notifications"></div>
</div>
<script src="//cdn.ckeditor.com/4.15.0/standard/ckeditor.js"></script>
<script src="//unpkg.com/vue-ckeditor2"></script>

<script data-my_var_1="<?php echo base_url() ?>" data-my_var_2="<?php echo $idtarea; ?>" src="<?php echo base_url(); ?>/assets/vue/appvue/alumno/tarea/appdetalletarea.js"></script> 