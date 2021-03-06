<?php

defined('BASEPATH') or exit('No direct script access allowed');
date_default_timezone_set("America/Mexico_City");

class Tutor extends CI_Controller
{

    function __construct()
    {
        parent::__construct();
        if (!isset($_SESSION['user_id'])) {
            $this->session->set_flashdata('flash_data', 'You don\'t have access! ss');
            return redirect('welcome');
        }
        $this->load->helper('url');
        $this->load->model('tutor_model', 'tutor');
        $this->load->model('alumno_model', 'alumno');
        $this->load->model('user_model', 'user');
        $this->load->model('data_model');
        $this->load->library('permission');
        $this->load->library('session');
    }

    public function inicio()
    {
        Permission::grant(uri_string());
        $this->load->view('admin/header');
        $this->load->view('admin/tutor/index');
        $this->load->view('admin/footer');
    }

    public function showAll()
    {
        //Permission::grant(uri_string()); 
        $idplantel = $this->session->idplantel;
        $query = $this->tutor->showAll();
        if ($query) {
            $result['tutores'] = $this->tutor->showAll($idplantel);
        }
        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }

    public function showDetalleTutor()
    {

        $idtutor = $this->input->get('idtutor');
        $query = $this->tutor->detalleTutor($idtutor);
        if ($query) {
            $result['detalle_tutor'] = $this->tutor->detalleTutor($idtutor);
        }
        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }

    public function subirFoto()
    {
        if (Permission::grantValidar(uri_string()) == 1) {
            if (isset($_FILES['file']['name']) && !empty($_FILES['file']['name'])) {
                $mi_archivo = 'file';
                $config['upload_path'] = "assets/tutores/";
                //$config['file_name'] = 'Avatar' . date("Y-m-d his");
                //$config['allowed_types'] = "*";
                $config['allowed_types'] = 'jpg|jpeg|png';
                $config['max_size'] = "50000";
                $config['max_width'] = "2000";
                $config['max_height'] = "2000";
                $file_name = $_FILES['file']['name'];
                $tmp = explode('.', $file_name);
                $extension_img = end($tmp);
                $user_img_profile = date("Y-m-dhis") . '.' . $extension_img;
                $config['file_name'] = $user_img_profile;

                $this->load->library('upload', $config);

                if (!$this->upload->do_upload($mi_archivo)) {
                    //*** ocurrio un error
                    //$data['state'] = 500;
                    //$data['message'] = $this->upload->display_errors();
                    //echo $this->upload->display_errors();
                    // echo json_encode($data);

                    $result['error'] = true;
                    $result['msg'] = array(
                        'msgerror' => $this->upload->display_errors()
                    );
                    return;
                } else {
                    $id = $this->input->post('idtutor');
                    $data = array(
                        'foto' => $user_img_profile,
                        'idusuario' => $this->session->user_id,
                        'fecharegistro' => date('Y-m-d H:i:s')
                    );
                    $this->tutor->updateTutor($id, $data);
                }
            } else {
                $result['error'] = true;
                $result['msg'] = array(
                    'msgerror' => 'Seleccioar la foto.'
                );
            }
        } else {
            $result['error'] = true;
            $result['msg'] = array(
                'msgerror' => "NO TIENE PERMISOS PARA REALIZAR ESTA ACCIÓN."
            );
        }
        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }

    public function showAllAlumnos()
    {
        //Permission::grant(uri_string()); 
        $idplantel = $this->session->idplantel;
        $query = $this->tutor->showAllAlumnos();
        if ($query) {
            $result['alumnos'] = $this->tutor->showAllAlumnos($idplantel);
        }
        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }

    public function showAllTutorAlumnos($idtutor)
    {
        //Permission::grant(uri_string()); 
        $query = $this->tutor->showAllTutorAlumnos($idtutor);
        if ($query) {
            $result['alumnos'] = $this->tutor->showAllTutorAlumnos($idtutor);
        }
        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }

    public function addTutor()
    {
        if (Permission::grantValidar(uri_string()) == 1) {
            $config = array(
                array(
                    'field' => 'nombre',
                    'label' => 'Nombre',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => '%s es obligatorio.'
                    )
                ),
                array(
                    'field' => 'apellidop',
                    'label' => 'A. Paterno',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => '%s es obligatorio.'
                    )
                ),
                array(
                    'field' => 'fnacimiento',
                    'label' => 'Fecha nacimiento',
                    'rules' => 'trim|required|callback_validarFecha',
                    'errors' => array(
                        'required' => '%s es  obligatorio.'
                    )
                ), array(
                    'field' => 'direccion',
                    'label' => 'Dirección',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => '%s es  obligatorio.'
                    )
                ),
                array(
                    'field' => 'telefono',
                    'label' => 'Telefono',
                    'rules' => 'trim|required|integer|exact_length[10]|regex_match[/^[0-9]{10}$/]',
                    'errors' => array(
                        'required' => '%s es  obligatorio.',
                        'integer' => '%s debe ser solo número.',
                        'exact_length' => '%s debe tener 10 digitos.'
                    )
                ),
                array(
                    'field' => 'correo',
                    'label' => 'Correo',
                    'rules' => 'trim|required|valid_email',
                    'errors' => array(
                        'required' => '%s es  obligatorio.',
                        'valid_email' => '%s no es valido.'
                    )
                ),
                array(
                    'field' => 'password',
                    'label' => 'Contraseña',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => '%s es  obligatorio.'
                    )
                ),
                array(
                    'field' => 'rfc',
                    'label' => 'RFC',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => '%s es  obligatorio.'
                    )
                ),
                array(
                    'field' => 'factura',
                    'label' => 'Factura',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => '%s es  obligatorio.'
                    )
                )
            );

            $this->form_validation->set_rules($config);
            if ($this->form_validation->run() == FALSE) {
                $result['error'] = true;
                $result['msg'] = array(
                    'nombre' => form_error('nombre'),
                    'apellidop' => form_error('apellidop'),
                    'fnacimiento' => form_error('fnacimiento'),
                    'telefono' => form_error('telefono'),
                    'correo' => form_error('correo'),
                    'direccion' => form_error('direccion'),
                    'password' => form_error('password'),
                    'rfc' => form_error('rfc'),
                    'factura' => form_error('factura')
                );
            } else {
                $factura = trim($this->input->post('factura'));
                $rfc = trim($this->input->post('rfc'));
                $correo = trim($this->input->post('correo'));
                $validar = $this->tutor->validarAddTutor($correo, $this->session->idplantel);
                if ($validar == FALSE) {
                    $password_encrypted = password_hash(trim($this->input->post('password')), PASSWORD_BCRYPT);
                    $data = array(
                        'idplantel' => $this->session->idplantel,
                        'nombre' => strtoupper($this->input->post('nombre')),
                        'apellidop' => strtoupper($this->input->post('apellidop')),
                        'apellidom' => strtoupper($this->input->post('apellidom')),
                        'escolaridad' => strtoupper($this->input->post('escolaridad')),
                        'ocupacion' => strtoupper($this->input->post('ocupacion')),
                        'dondetrabaja' => strtoupper($this->input->post('dondetrabaja')),
                        'fnacimiento' => $this->input->post('fnacimiento'),
                        'direccion' => strtoupper($this->input->post('direccion')),
                        'telefono' => $this->input->post('telefono'),
                        'correo' => $this->input->post('correo'),
                        'password' => $password_encrypted,
                        'rfc' => strtoupper($rfc),
                        'foto' => '',
                        'factura' => $factura,
                        'idusuario' => $this->session->user_id,
                        'fecharegistro' => date('Y-m-d H:i:s')
                    );
                    $idtutor = $this->tutor->addTutor($data);
                    $datausuario = array(
                        'idusuario' => $idtutor,
                        'idtipousuario' => 5,
                        'fecharegistro' => date('Y-m-d H:i:s')
                    );
                    $idusuario = $this->user->addUser($datausuario);
                    $data_usuario_rol = array(
                        'id_rol' => 11,
                        'id_user' => $idusuario
                    );
                    $id_usuario_rol = $this->user->addUserRol($data_usuario_rol);
                } else {
                    $result['error'] = true;
                    $result['msg'] = array(
                        'msgerror' => "El correo electrico ya esta registrado."
                    );
                }
            }
        } else {
            $result['error'] = true;
            $result['msg'] = array(
                'msgerror' => "NO TIENE PERMISOS PARA REALIZAR ESTA ACCIÓN."
            );
        }

        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }

    public function updateTutor()
    {
        if (Permission::grantValidar(uri_string()) == 1) {
            $config = array(
                array(
                    'field' => 'nombre',
                    'label' => 'Nombre',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => '%s es  obligatorio.'
                    )
                ),
                array(
                    'field' => 'apellidop',
                    'label' => 'A. Paterno',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => '%s es obligatorio.'
                    )
                ),
                array(
                    'field' => 'fnacimiento',
                    'label' => 'Fecha nacimiento',
                    'rules' => 'trim|required|callback_validarFecha',
                    'errors' => array(
                        'required' => '%s es  obligatorio.'
                    )
                ), array(
                    'field' => 'direccion',
                    'label' => 'Dirección',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => '%s es  obligatorio.'
                    )
                ),
                array(
                    'field' => 'rfc',
                    'label' => 'RFC',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => '%s es  obligatorio.'
                    )
                ),
                array(
                    'field' => 'telefono',
                    'label' => 'Telefono',
                    'rules' => 'trim|required|integer|exact_length[10]',
                    'errors' => array(
                        'required' => '%s es  obligatorio.',
                        'integer' => '%s debe ser solo número.',
                        'exact_length' => '%s debe tener 10 digitos.'
                    )
                ),
                array(
                    'field' => 'password',
                    'label' => 'Contraseña',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => '%s es  obligatorio.'
                    )
                )
            );

            $this->form_validation->set_rules($config);
            if ($this->form_validation->run() == FALSE) {
                $result['error'] = true;
                $result['msg'] = array(
                    'nombre' => form_error('nombre'),
                    'apellidop' => form_error('apellidop'),
                    'fnacimiento' => form_error('fnacimiento'),
                    'telefono' => form_error('telefono'),
                    'correo' => form_error('correo'),
                    'direccion' => form_error('direccion'),
                    'rfc' => form_error('rfc'),
                    'password' => form_error('password')
                );
            } else {
                $idtutor = $this->input->post('idtutor');
                $correo = trim($this->input->post('correo'));
                $validar = $this->tutor->validarUpdateTutor($idtutor, $correo, $this->session->idplantel);
                if ($validar == FALSE) {
                    $data = array(
                        'idplantel' => $this->session->idplantel,
                        'nombre' => mb_strtoupper($this->input->post('nombre')),
                        'apellidop' => mb_strtoupper($this->input->post('apellidop')),
                        'apellidom' => mb_strtoupper($this->input->post('apellidom')),
                        'escolaridad' => mb_strtoupper($this->input->post('escolaridad')),
                        'ocupacion' => mb_strtoupper($this->input->post('ocupacion')),
                        'dondetrabaja' => mb_strtoupper($this->input->post('dondetrabaja')),
                        'fnacimiento' => $this->input->post('fnacimiento'),
                        'direccion' => mb_strtoupper($this->input->post('direccion')),
                        'telefono' => $this->input->post('telefono'),
                        'correo' => $this->input->post('correo'),
                        'rfc' => $this->input->post('rfc'),
                        'factura' => $this->input->post('factura'),
                        'idusuario' => $this->session->user_id,
                        'fecharegistro' => date('Y-m-d H:i:s')
                    );
                    $this->tutor->updateTutor($idtutor, $data);
                } else {
                    $result['error'] = true;
                    $result['msg'] = array(
                        'msgerror' => "El correo electrico ya esta registrado."
                    );
                }
            }
        } else {
            $result['error'] = true;
            $result['msg'] = array(
                'msgerror' => "NO TIENE PERMISO PARA REALIZAR ESTA ACCIÓN."
            );
        }

        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }

    function validarFecha($fecha)
    {
        $parts = explode("/", $fecha);
        if (count($parts) == 3) {
            if (checkdate($parts[1], $parts[0], $parts[2])) {
                return true;
            } else {
                $this->form_validation->set_message(
                    'validarFecha',
                    'Formato no valido.'
                );
                return false;
            }
        } else {
            $this->form_validation->set_message(
                'validarFecha',
                'Formato no valido.'
            );
            return false;
        }
    }

    public function searchTutor()
    {
        //Permission::grant(uri_string());
        $value = $this->input->post('text');
        $idplantel = $this->session->idplantel;
        $query = $this->tutor->searchTutor($value, $idplantel);
        if ($query) {
            $result['tutores'] = $query;
        }
        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }

    public function alumnos($id)
    {
        Permission::grant(uri_string());
        # code...
        $data = array(
            'id' => $id,
            'detalle' => $this->tutor->detalleTutor($id)
        );
        $this->load->view('admin/header');
        $this->load->view('admin/tutor/detalle', $data);
        $this->load->view('admin/footer');
    }

    public function addTutorAlumno()
    {
        if (Permission::grantValidar(uri_string()) == 1) {
            $config = array(
                array(
                    'field' => 'idalumno',
                    'label' => 'Nombre',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => 'Campo obligatorio.'
                    )
                )
            );

            $this->form_validation->set_rules($config);
            if ($this->form_validation->run() == FALSE) {
                $result['error'] = true;
                $result['msg'] = array(
                    'idalumno' => form_error('idalumno')
                );
            } else {
                $idtutor = $this->input->post('idtutor');
                $idalumno = $this->input->post('idalumno');
                $validar = $this->alumno->validarAsignarTutor($idalumno, $idtutor, $this->session->idplantel);
                if (!$validar) {
                    $data = array(
                        'idtutor' => $this->input->post('idtutor'),
                        'idalumno' => $this->input->post('idalumno')
                    );
                    $this->tutor->addTutorAlumno($data);
                    $result['error'] = false;
                    $result['success'] = 'User updated successfully';
                } else {
                    $result['error'] = true;
                    $result['msg'] = array(
                        'msgerror' => 'Ya esta asignado el Alumno al Tutor.'
                    );
                }
            }
        } else {
            $result['error'] = true;
            $result['msg'] = array(
                'msgerror' => 'NO TIENE PERMISO PARA REALIZAR ESTA ACCIÓN.'
            );
        }
        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }

    public function deleteAlumno()
    {
        if (Permission::grantValidar(uri_string()) == 1) {
            $id = $this->input->get('id');
            $query = $this->tutor->deleteAlumno($id);
            if ($query) {
                $result['error'] = false;
            } else {
                $result['error'] = true;
                $result['msg'] = array(
                    'msgerror' => 'No se puede Quitar el Alumno.'
                );
            }
        } else {
            $result['error'] = true;
            $result['msg'] = array(
                'msgerror' => 'NO TIENE PERMISO PARA REALIZAR ESTA ACCIÓN.'
            );
        }
        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }

    public function deleteTutor()
    {
        if (Permission::grantValidar(uri_string()) == 1) {
            $idtutor = $this->input->get('idtutor');
            $query = $this->tutor->deleteTutor($idtutor);
            if ($query) {
                $result['error'] = false;
            } else {
                $result['error'] = true;
                $result['msg'] = array(
                    'msgerror' => 'No se puede Elimnar el Alumno.'
                );
            }
        } else {
            $result['error'] = true;
            $result['msg'] = array(
                'msgerror' => 'NO TIENE PERMISO PARA REALIZAR ESTA ACCIÓN.'
            );
        }
        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }

    public function updatePassword()
    {
        if (Permission::grantValidar(uri_string()) == 1) {
            $config = array(
                array(
                    'field' => 'password1',
                    'label' => 'Nombre',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => 'Campo obligatorio.'
                    )
                ),
                array(
                    'field' => 'password2',
                    'label' => 'Nombre',
                    'rules' => 'trim|required',
                    'errors' => array(
                        'required' => 'Campo obligatorio.'
                    )
                )
            );

            $this->form_validation->set_rules($config);
            if ($this->form_validation->run() == FALSE) {
                $result['error'] = true;
                $result['msg'] = array(
                    'password1' => form_error('password1'),
                    'password2' => form_error('password2')
                );
            } else {
                if ($this->input->post('password1') == $this->input->post('password2')) {
                    $id = $this->input->post('idtutor');
                    $password_encrypted = password_hash(trim($this->input->post('password1')), PASSWORD_BCRYPT);

                    $data = array(
                        'password' => $password_encrypted,
                        'idusuario' => $this->session->user_id,
                        'fecharegistro' => date('Y-m-d H:i:s')
                    );
                    $this->tutor->updateTutor($id, $data);
                } else {
                    $result['error'] = true;
                    $result['msg'] = array(
                        'msgerror' => "La Contraseña no coinciden."
                    );
                }
            }
        } else {
            $result['error'] = true;
            $result['msg'] = array(
                'msgerror' => "NO TIENE PERMISO PARA REALIZAR ESTA ACCIÓN."
            );
        }
        if (isset($result) && !empty($result)) {
            echo json_encode($result);
        }
    }
}
