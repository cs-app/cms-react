import React, {Component, Fragment} from "react";
import Select from "react-select";
import {connect} from "react-redux";
import {
    loadMasterDocument,
    userUploadDocument,
    loadUserDocument,
    removeUserDocument
} from "../../redux/actions/reduxActionDataDigital";
import AddIcon from "@material-ui/icons/Add";
import swal from "sweetalert";
import {BASE_URL} from "../../redux/constants/action-types";
import {Button} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import RemoveIcon from "mdi-react/RemoveIcon";
import {Delete} from "@material-ui/icons";
import DeleteIcon from "mdi-react/DeleteIcon";

class EmployeeDataDigitalForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: 0,
            ext: '',
            file: '',
            user: JSON.parse(localStorage.getItem('user'))
        }
        this.handleChangeSelect = this.handleChangeSelect.bind(this)
        this.handleChangeFile = this.handleChangeFile.bind(this)
        this.handleUpload = this.handleUpload.bind(this)
        this.handleRemoveDocument = this.handleRemoveDocument.bind(this)
        this.props.loadMasterDocument()
        this.props.loadUserDocument()
    }

    componentDidMount(props) {

    }

    componentDidUpdate(props) {
        console.log(this.props.uploadDocument)
        if (props.uploadDocument !== this.props.uploadDocument) {
            swal("Cuti", "Pengajuan cuti berhasil!", "success");
            this.props.loadUserDocument()
        }
        if (props.userDocument !== this.props.userDocument) {
            // this.props.loadUserDocument()
        }
    }

    handleRemoveDocument(o) {
        const request = {
            document_id: o.id
        }
        swal({
            title: "Hapus document",
            text: "hapus dokumen " + o.document.label + "?",
            icon: "info",
            buttons: true,
            dangerMode: false,
        }).then((willDelete) => {
            if (willDelete) {
                this.props.removeUserDocument(request);
            }
        });

    }

    handleChangeSelect(e) {
        this.setState({type: e.value})
    }

    getFileExtension(filename) {
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    async handleChangeFile(e) {
        const file = e.target.files[0]
        if (file) {
            const base64 = await new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(file)
                fileReader.onload = () => {
                    this.setState({ext: this.getFileExtension(file.name), file: fileReader.result})
                    // resolve(fileReader.result);
                }
                fileReader.onerror = (error) => {
                    this.setState({ext: '', file: ''})
                    // reject(error);
                }
            })
        } else {
            this.setState({ext: '', file: ''})
        }
    }

    handleUpload(event) {
        event.preventDefault()
        const param = {
            type: this.state.type,
            ext: this.state.ext,
            file: this.state.file
        }
        if ('' === param.ext) {
            return true
        }
        this.props.userUploadDocument(param)
    }


    documentExist(o) {
        if (null === o.path) {
            return '-'
        }
        if ('' === o.path) {
            return '-'
        }
        return (
            <a href="#" style={{marginTop: -10}}
               onClick={() => {
                   const {user} = this.state
                   fetch(BASE_URL + '/api/v1/download/user/' + user.nip + '/' + o.id)
                       .then(response => {
                           if (response.ok) {
                               response.blob().then(blob => {
                                   let url = window.URL.createObjectURL(blob);
                                   let a = document.createElement('a');
                                   a.href = url;
                                   a.download = user.nip + '-' + o.document.label + '.' + this.getFileExtension(o.path);
                                   a.click();
                               });
                           }
                       }).catch(function (err) {
                   });
               }}>download</a>
        )
    }

    backAction() {
        this.setState({direct: true})
        this.renderRedirect()
    }

    renderRedirect() {
        const body = {}
        if (this.state.direct) {
            return <Redirect to={{
                pathname: '/employee',
                state: {body: JSON.stringify(body)}
            }}/>
        }
    }

    render() {
        const {user} = this.state
        if (user === null) {
            return (
                <></>
            )
        }
        const {masterDocument, userDocument} = this.props
        console.log(userDocument.result)
        return (
            <Fragment>
                <div className="row">
                    <div className="col-md-3 grid-margin">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Form Data Digital</h4>
                                <p className="card-description">
                                    Upload dokumen anda
                                </p>
                                <form className="forms-sample" onSubmit={this.handleUpload}>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputEmail1">Tipe Dokumen</label>
                                        <Select className="form-control select-tmd" options={masterDocument}
                                                onChange={this.handleChangeSelect}
                                                label="Single select"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="exampleInputPassword1">Dokumen</label>
                                        <input type="file" className="form-control" onChange={this.handleChangeFile}/>
                                    </div>
                                    <button type="submit" className="btn btn-success mr-2">Upload</button>
                                    <Button variant="secondary" onClick={() => this.backAction()}>
                                        Close
                                    </Button>
                                </form>
                            </div>
                        </div>

                    </div>

                    <div className="col-md-9 grid-margin">

                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Data Digital</h4>
                                <p className="card-description">
                                    Dokumen anda
                                </p>
                                <div className="table-responsive row">
                                    <table className="table">
                                        <thead>
                                        <tr>
                                            <th>Opsi</th>
                                            <th>Dokumen</th>
                                            <th>Download</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {userDocument.result.map((o, i) =>
                                            <tr key={i}>
                                                <td>
                                                    <button type="button"
                                                            className="btn btn-danger btn-sm btn-option"
                                                            onClick={() => this.handleRemoveDocument(o)}>
                                                        <i className="mdi mdi-24px mdi-delete-circle"/>
                                                    </button>
                                                </td>
                                                <td>{o.document.label}</td>
                                                <td>{this.documentExist(o)}</td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                {this.renderRedirect()}
            </Fragment>
        )
    }

}

function mapStateToProps(state) {
    return {
        masterDocument: state.masterDocument.result,
        uploadDocument: state.uploadDocument,
        userDocument: state.userDocument
    }
}

export default connect(
    mapStateToProps, {loadMasterDocument, userUploadDocument, loadUserDocument, removeUserDocument}
)(EmployeeDataDigitalForm);