

<!-- page content -->
<div class="right_col" role="main">
    <div class="">
        <div class="clearfix"></div>
        <div class="row">
            <div class="col-md-12 col-sm-12 col-xs-12">
                <div class="x_panel">
                    <div class="x_title">
                        <h2><strong>ADMINISTRAR PERSMISOS</strong></h2>

                        <div class="clearfix"></div>
                    </div>
                    <div class="x_content">
                        <div id="app">
                            <div class="container">
                                <div class="row">
                                    <transition
                                        enter-active-class="animated fadeInLeft"
                                        leave-active-class="animated fadeOutRight">
                                        <div class="notification is-success text-center px-5 top-middle" v-if="successMSG" @click="successMSG = false">{{successMSG}}</div>
                                    </transition>
                                    <div class="col-md-12  col-sm-12 col-xs-12">
                                        <div class="row">
                                            <div class="col-md-6  col-sm-12 col-xs-12">
                                                <button class="btn btn-round btn-primary" @click="abrirAddModal()"><i class='fa fa-plus'></i>  Nuevo Permiso</button>
                                                <a  href="<?= base_url('/User/') ?>" class="btn btn-round btn-default">Usuarios</a>
                                                <a  href="<?= base_url('/Rol/') ?>" class="btn btn-round btn-default">Rol</a>

                                            </div>
                                            <div class="col-md-6  col-sm-12 col-xs-12"></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6  col-sm-12 col-xs-12">
                                            </div>
                                            <div class="col-md-6  col-sm-12 col-xs-12">
                                                <input placeholder="Buscar" type="search" class="form-control btn-round" :autofocus="'autofocus'"  v-model="search.text" @keyup="searchPermiso" name="search">
                                            </div>
                                        </div>
                                        <br>
                                        <table class="table table-hover table-striped">
                                            <thead class="bg-teal">
                                                 <th class="text-white" v-column-sortable:description>Descripción </th>
                                            <th class="text-white" v-column-sortable:uri>Permiso </th>
                                           
                                            <th class="text-center text-white">Opción </th>
                                            </thead>
                                            <tbody class="table-light">
                                                <tr v-for="permiso in permisos" class="table-default">
                                                     <td>{{permiso.description}}</td> 
                                                    <td>{{permiso.uri}}</td> 
                                                   
                                                    <td align="right">
                                                        <button type="button" class="btn btn-icons btn-sm btn-rounded btn-success" @click="abrirEditModal(); selectPermiso(permiso)" title="Modificar Datos">
                                                           <i class='fa fa-edit'></i> Editar
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr v-if="emptyResult">
                                                    <td colspan="9" rowspan="4" class="text-center h4">No encontrado</td>
                                                </tr>
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="5" align="right">
                                            <pagination
                                                :current_page="currentPage"
                                                :row_count_page="rowCountPage"
                                                @page-update="pageUpdate"
                                                :total_users="totalPermisos"
                                                :page_range="pageRange"
                                                >
                                            </pagination>

                                            </td>
                                            </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div> 
                            </div>
                            <?php include 'modal.php'; ?>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- /page content -->
 <script src="<?php echo base_url(); ?>/assets/js/vue-column-sortable.js"></script>
<script data-my_var_1="<?php echo base_url() ?>" src="<?php echo base_url(); ?>/assets/vue/appvue/apppermiso.js"></script> 