/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    var this_js_script = $('script[src*=tutor_recuperacion]');
    var my_var_1 = this_js_script.attr('data-my_var_1');
    if (typeof my_var_1 === "undefined") {
        var my_var_1 = 'some_default_value';
    }
    $(document).on("click", '.edit_button', function (e) {
        var idcalificacion = $(this).data('idcalificacion');
        var calificacion = $(this).data('calificacion');
        var nombre = $(this).data('alumno');

        $(".idcalificacion").val(idcalificacion);
        $(".calificacion").val(calificacion);
        $("#alumno").text(nombre);
    });
    $(document).on("click", '.delete_button', function (e) {
        var idcalificacion = $(this).data('idcalificacion');
        var nombre = $(this).data('alumno');

        $(".idcalificacion").val(idcalificacion);
        $("#alumnodelete").text(nombre);
    });

    $("#btnguardar").click(function () {
        $('#btnguardar').prop("disabled", true);
        $('#btnguardar').html(
            `<span class="fa fa-spinner spinner-border-sm" role="status" aria-hidden="true"></span> PROCESANDO...`
        );
        $.ajax({
            type: "POST",
            url: my_var_1 + "Pgrupo/addCalificacionRecuperacion",
            data: $('#frmasistencia').serialize(),
            success: function (data) {
                $('#btnguardar').prop("disabled", false);
                $('#btnguardar').html(
                    `<i class='fa fa-floppy-o'></i> GUARDAR`
                );
                var val = $.parseJSON(data);
                if ((val.success === "Ok")) {
                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Notificación!',
                        html: val.mensaje,
                        showConfirmButton: true,
                    }).then(function () {
                        location.reload();
                    });
                } else {
                    swal({
                        type: 'info',
                        title: 'Notificación',
                        html: val.error,
                        customClass: 'swal-wide',
                        footer: ''
                    });
                }

            }
        })
    });
    $("#btneliminarcalificacionrecuperacion").click(function () {
        $('#btneliminarcalificacionrecuperacion').prop("disabled", true);
        $('#btneliminarcalificacionrecuperacion').html(
            `<span class="fa fa-spinner spinner-border-sm" role="status" aria-hidden="true"></span> PROCESANDO...`
        );
        $.ajax({
            type: "POST",
            url: my_var_1 + "Pgrupo/eliminarCalificacionUnidadRecuperacion",
            data: $('#frmeliminarcalificacion').serialize(),
            success: function (data) {
                $('#btneliminarcalificacionrecuperacion').prop("disabled", false);
                $('#btneliminarcalificacionrecuperacion').html(
                    `<i class="fa fa-trash"></i> ELIMINAR`
                );
                var val = $.parseJSON(data);
                if ((val.success === "Ok")) {
                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Eliminado!',
                        text: 'Fue eliminado la calificación con exito.',
                        showConfirmButton: true
                    }).then(function () {
                        location.reload();
                    });
                } else {
                    swal({
                        type: 'info',
                        title: 'Notificación',
                        html: val.error,
                        customClass: 'swal-wide',
                        footer: ''
                    });
                }

            }
        })
    });
    $("#btneliminarcalificacion").click(function () {
        $('#btneliminarcalificacion').prop("disabled", true);
        $('#btneliminarcalificacion').html(
            `<span class="fa fa-spinner spinner-border-sm" role="status" aria-hidden="true"></span> PROCESANDO...`
        );
        $.ajax({
            type: "POST",
            url: my_var_1 + "Pgrupo/eliminarCalificacionUnidad",
            data: $('#frmeliminarcalificacion').serialize(),
            success: function (data) {
                $('#btneliminarcalificacion').prop("disabled", false);
                $('#btneliminarcalificacion').html(
                    `<i class="fa fa-trash"></i> ELIMINAR`
                );
                var val = $.parseJSON(data);
                if ((val.success === "Ok")) {
                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Eliminado!',
                        text: 'Fue eliminado las calificaciones con exito.',
                        showConfirmButton: true
                    }).then(function () {
                        location.reload();
                    });
                } else if (val.success === "vacio") {
                    swal({
                        type: 'info',
                        title: 'Información',
                        html: val.mensaje,
                        customClass: 'swal-wide',
                        footer: ''
                    });
                } else {
                    swal({
                        type: 'info',
                        title: 'Notificación',
                        html: val.error,
                        customClass: 'swal-wide',
                        footer: ''
                    });
                }

            }
        })
    });
    $("#btneliminar").click(function () {
        $('#btneliminar').prop("disabled", true);
        $('#btneliminar').html(
            `<span class="fa fa-spinner spinner-border-sm" role="status" aria-hidden="true"></span> PROCESANDO...`
        );
        $.ajax({
            type: "POST",
            url: my_var_1 + "Pgrupo/eliminarCalificacion",
            data: $('#frmeliminar').serialize(),
            success: function (data) {
                var val = $.parseJSON(data);
                $('#btneliminar').prop("disabled", false);
                $('#btneliminar').html(
                    `<i class="fa fa-trash"></i> ELIMINAR`
                );
                if ((val.success === "Ok")) {
                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Eliminado!',
                        text: 'Fue eliminado la calificación con exito.',
                        showConfirmButton: true
                    }).then(function () {
                        location.reload();
                    });
                } else {
                    swal({
                        type: 'info',
                        title: 'Notificación',
                        html: val.error,
                        customClass: 'swal-wide',
                        footer: ''
                    });
                }

            }
        })
    });


    $("#btnmodificar").click(function () {
        $('#btnmodificar').prop("disabled", true);
        $('#btnmodificar').html(
            `<span class="fa fa-spinner spinner-border-sm" role="status" aria-hidden="true"></span> PROCESANDO...`
        );
        $.ajax({
            type: "POST",
            url: my_var_1 + "Pgrupo/updateCalificacion",
            data: $('#frmmodificar').serialize(),
            success: function (data) {
                $('#btnmodificar').prop("disabled", false);
                $('#btnmodificar').html(
                    `<i class="fa fa-pencil"></i> MODIFICAR`
                );
                var val = $.parseJSON(data);
                if ((val.success === "Ok")) {
                    swal({
                        position: 'center',
                        type: 'success',
                        title: 'Modificado!',
                        text: 'Fue modificado la calificación con exito.',
                        showConfirmButton: true
                    }).then(function () {
                        location.reload();
                    });
                } else {
                    swal({
                        type: 'info',
                        title: 'Notificación',
                        html: val.error,
                        customClass: 'swal-wide',
                        footer: ''
                    });
                }

            }
        })
    });
});