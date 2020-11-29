import React, {Component} from "react";
import {
    USER_RESPONSE,
    USER_CRUD_RESPONSE
} from "../../../redux/constants/reducActionTypes";
import {emptyCrud} from "../../../application/AppConstant";
import {connect} from "react-redux";
import {updateProfile, userProfile} from "../../../redux/actions/reduxActionUser";
import swal from "sweetalert";

class EmployeeProfileForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nik: '',
            kk: '',
            no_rekening: '',
            nama_rekening: '',
            nama_bank: '',
            request: 0,
            errorServer: '',
        }
        this.submitForm = this.submitForm.bind(this)
        this.onChangeNIK = this.onChangeNIK.bind(this)
        this.onChangeKK = this.onChangeKK.bind(this)
        this.onChangeNoRek = this.onChangeNoRek.bind(this)
        this.onChangeNamaRek = this.onChangeNamaRek.bind(this)
        this.onChangeNamaBank = this.onChangeNamaBank.bind(this)
    }

    componentDidMount() {
        this.props.userProfile()
    }

    componentDidUpdate(props) {
        if (props.userUpdate !== this.props.userUpdate) {
            this.props.userProfile()
        }
        if (props.user !== this.props.user) {
            const user = this.props.user.result
            if (!user) return true
            localStorage.setItem('user', JSON.stringify(user))
            if (this.state.request === 1) {
                swal("Update profile", "Update data diri berhasil!", "success")
            }
            this.setState({
                nik: user.nik,
                kk: user.kk,
                no_rekening: user.no_rekening,
                nama_rekening: user.nama_rekening,
                nama_bank: user.nama_bank,
                request: 0,
                errorServer: '',
            })

        }
    }

    onChangeNIK(e) {
        this.setState({'nik': e.target.value})
    }

    onChangeKK(e) {
        this.setState({'kk': e.target.value})
    }

    onChangeNoRek(e) {
        this.setState({'no_rekening': e.target.value})
    }

    onChangeNamaRek(e) {
        this.setState({'nama_rekening': e.target.value})
    }

    onChangeNamaBank(e) {
        this.setState({'nama_bank': e.target.value})
    }

    submitForm(e) {
        e.preventDefault()
        const {nik, kk, no_rekening, nama_rekening, nama_bank} = this.state
        const param = {
            nik: nik,
            kk: kk,
            no_rekening: no_rekening,
            nama_rekening: nama_rekening,
            nama_bank: nama_bank,
        }
        this.props.updateProfile(param)
        this.setState({request: 1})
    }

    render() {
        const {nik, kk, no_rekening, nama_rekening, nama_bank} = this.state
        return (
            <div className="col-md-12">
                <form className="forms-sample" ref={(ref) => this.formRef = ref}
                      onSubmit={this.submitForm}
                      noValidate>
                    <div className="form-group">
                        <label>NIK</label>
                        <input type="text" className="form-control" placeholder="Nomor Induk KTP"
                               value={nik} onChange={this.onChangeNIK}
                        />
                    </div>
                    <div className="form-group">
                        <label>No. KK</label>
                        <input type="text" className="form-control" placeholder="Nomor Kartu Keluarga"
                               value={kk} onChange={this.onChangeKK}
                        />
                    </div>
                    <div className="form-group">
                        <label>No. Rekening</label>
                        <input type="text" className="form-control" placeholder="Nomor Rekening pensiun"
                               value={no_rekening} onChange={this.onChangeNoRek}
                        />
                    </div>
                    <div className="form-group">
                        <label>Nama Rekening</label>
                        <input type="text" className="form-control" placeholder="Nama Pemilik rekening pensiun"
                               value={nama_rekening} onChange={this.onChangeNamaRek}/>
                    </div>
                    <div className="form-group">
                        <label>Nama Bank</label>
                        <input type="text" className="form-control" placeholder="Nama Bank pensiun"
                               value={nama_bank} onChange={this.onChangeNamaBank}/>
                    </div>
                    <div className="form-group">
                        <span className="text-danger">{this.state.errorServer}</span>
                    </div>
                    <button type="submit" className="btn btn-success mr-2">Submit</button>

                </form>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: (state[USER_RESPONSE] ? state[USER_RESPONSE] : emptyCrud),
        userUpdate: (state[USER_CRUD_RESPONSE] ? state[USER_CRUD_RESPONSE] : emptyCrud)
    }
}

export default connect(mapStateToProps, {
    userProfile,
    updateProfile
})(EmployeeProfileForm)