<script src="<?php echo base_url(); ?>/assets/js/bootstrap.min.js"></script>

<!-- bootstrap progress js -->
<script src="<?php echo base_url(); ?>/assets/js/progressbar/bootstrap-progressbar.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/nicescroll/jquery.nicescroll.min.js"></script>
<!-- icheck -->
<script src="<?php echo base_url(); ?>/assets/js/icheck/icheck.min.js"></script>

<script src="<?php echo base_url(); ?>/assets/js/custom.js"></script>
<!-- pace -->
<script src="<?php echo base_url(); ?>/assets/js/pace/pace.min.js"></script>

<!-- image cropping -->
<script src="<?php echo base_url(); ?>/assets/js/cropping/cropper.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/cropping/main.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/moment/moment.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/calendar/fullcalendar.min.js"></script>

<!--<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>-->
<!-- Datatables-->
<script src="<?php echo base_url(); ?>/assets/js/datatables/jquery.dataTables.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/dataTables.bootstrap.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/dataTables.buttons.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/buttons.bootstrap.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/jszip.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/pdfmake.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/vfs_fonts.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/buttons.html5.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/buttons.print.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/dataTables.fixedHeader.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/dataTables.keyTable.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/dataTables.responsive.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/responsive.bootstrap.min.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/datatables/dataTables.scroller.min.js"></script>

<script src="<?php echo base_url(); ?>/assets/js/bootstrap-select.js" type="text/javascript"></script>

<!-- Ckeditor -->
<script src="<?php echo base_url(); ?>/assets/plugins/ckeditor/ckeditor.js"></script>

<!-- TinyMCE -->
<script src="<?php echo base_url(); ?>/assets/plugins/tinymce/tinymce.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/tablas.js"></script>

<script data-my_var_1="<?php echo base_url() ?>" src="<?php echo base_url(); ?>/assets/js/validar/direccion.js">
</script>
 <!-- PNotify -->
<script type="text/javascript" src="<?php echo base_url(); ?>/assets/js/notify/pnotify.core.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>/assets/js/notify/pnotify.buttons.js"></script>
<script type="text/javascript" src="<?php echo base_url(); ?>/assets/js/notify/pnotify.nonblock.js"></script>
<script src="<?php echo base_url(); ?>/assets/plugins/node-waves/waves.js"></script>
<script src="<?php echo base_url(); ?>/assets/js/admin.js"></script>
<script>
    $(function () {
        var cnt = 10; //$("#custom_notifications ul.notifications li").length + 1;
        TabbedNotification = function (options) {
            var message = "<div id='ntf" + cnt + "' class='text alert-" + options.type +
                    "' style='display:none'><h2><i class='fa fa-bell'></i> " + options.title +
                    "</h2><div class='close'><a href='javascript:;' class='notification_close'><i class='fa fa-close'></i></a></div><p>" +
                    options.text + "</p></div>";

            if (document.getElementById('custom_notifications') == null) {
                alert('doesnt exists');
            } else {
                $('#custom_notifications ul.notifications').append("<li><a id='ntlink" + cnt +
                        "' class='alert-" + options.type + "' href='#ntf" + cnt +
                        "'><i class='fa fa-bell animated shake'></i></a></li>");
                $('#custom_notifications #notif-group').append(message);
                cnt++;
                CustomTabs(options);
            }
        }

        CustomTabs = function (options) {
            $('.tabbed_notifications > div').hide();
            $('.tabbed_notifications > div:first-of-type').show();
            $('#custom_notifications').removeClass('dsp_none');
            $('.notifications a').click(function (e) {
                e.preventDefault();
                var $this = $(this),
                        tabbed_notifications = '#' + $this.parents('.notifications').data(
                        'tabbed_notifications'),
                        others = $this.closest('li').siblings().children('a'),
                        target = $this.attr('href');
                others.removeClass('active');
                $this.addClass('active');
                $(tabbed_notifications).children('div').hide();
                $(target).show();
            });
        }

        CustomTabs();

        var tabid = idname = '';
        $(document).on('click', '.notification_close', function (e) {
            idname = $(this).parent().parent().attr("id");
            tabid = idname.substr(-2);
            $('#ntf' + tabid).remove();
            $('#ntlink' + tabid).parent().remove();
            $('.notifications a').first().addClass('active');
            $('#notif-group div').first().css('display', 'block');
        });
    })
</script>
<script type="text/javascript">
    var permanotice, tooltip, _alert;
    $(function () {
<?php
if (isset($tareas) && !empty($tareas)) {

    foreach ($tareas as $value) {
        if ($value->idnotificaciontutor == 1) {
            setlocale(LC_ALL, 'es_ES');
            $date = new Datetime($value->fechaentrega);
            $fecha = strftime("%A, %d de %B", $date->getTimestamp());
            ?>
                    new TabbedNotification({
                        title: 'TAREA',
                        text: <?php echo "'Usted tiene una nueva tarea de: $value->nombreclase.<br/>Fecha de entrega: $fecha'"; ?>,
                        type: 'info',
                        sound: true
                    });
            <?php
        }
    }
}
if (isset($mensajes) && !empty($mensajes)) {

    foreach ($mensajes as $value) {
        if ($value->idnotificaciontutor == 1) {
            ?>
                    new TabbedNotification({
                        title: 'MENSAJE',
                        text: <?php echo "'Usted tiene una nuevo mensaje de: $value->nombreclase'"; ?>,
                        type: 'info',
                        sound: true
                    });
            <?php
        }
    }
}
?>



    });
</script> 
<script type="text/javascript">
    $(function () {
        //CKEditor
        CKEDITOR.replace('ckeditor');
        CKEDITOR.config.height = 200;
    });
</script>

<script type="text/javascript">
    $(function () {
        //CKEditor
        CKEDITOR.replace('ckeditoredit');
        CKEDITOR.config.height = 200;
    });
</script>
<script type="text/javascript">
    $(document).ready(function (e) {
        $('.selectpicker').selectpicker();
    });
</script>
<script>
    $('#mensajecp').hide();
</script>
</body>

</html>