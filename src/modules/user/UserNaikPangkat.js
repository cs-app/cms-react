import React, {Component, Fragment} from "react";
import Pagination from "react-bootstrap-4-pagination";
import {
    BASE_URL, DUK_FILTER_PARAM, DUK_FILTER_PARAM_RESPONSE,
    DUK_PAGE_RESPONSE, USER_PAGE_RESPONSE
} from "../../redux/constants/reducActionTypes";
import {
    emptyContentPage,
    emptyCrud,
    JENIS_CUTI,
    MAX_PENSIUN,
    MONTHS,
    STATUS_PEGAWAI
} from "../../application/AppConstant";
import {connect} from "react-redux";
import {listDuk, pageDuk, paramDuk} from "../../redux/actions/reduxActionMasterDUK";
import {formatDate, getFileExtension} from "../../application/AppCommons";
import moment from "moment";
import Select from "react-select";
import {pageUser} from "../../redux/actions/reduxActionUser";
import {Redirect} from "react-router-dom";

class UserNaikPangkat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            filter: '',
            year: moment().year(),
            month: moment().month(),
            directBody: null,
            direct: false
        };
        this.changePage = this.changePage.bind(this)
        this.downloadEmployeeNaikPangkat = this.downloadEmployeeNaikPangkat.bind(this)
        this.handleChangeYearSelect = this.handleChangeYearSelect.bind(this)
        this.handleChangeMonthSelect = this.handleChangeMonthSelect.bind(this)
        this.handleChangeName = this.handleChangeName.bind(this)
    }

    componentDidMount() {
        this.props.pageUser({
            filter: '',
            module: 'naikpangkat',
            year: this.state.year,
            month: this.state.month,
            page: 0
        })
    }

    componentDidUpdate(props) {
        if (props.crud !== this.props.crud) {
            this.setState({id: 0, name: ''})
            this.props.pageUser({filter: "", module: 'naikpangkat', page: this.state.page})
        }
    }

    changePage(page) {
        this.setState({page: page - 1})
        const request = {
            filter: this.state.filter,
            year: this.state.year,
            month: this.state.month,
            module: 'naikpangkat',
            page: page - 1
        }
        this.props.pageUser(request)
    }

    handleChangeName(event) {
        const request = {
            filter: event.target.value,
            year: this.state.year,
            month: this.state.month,
            module: 'naikpangkat',
            page: 0
        }
        this.props.pageUser(request)
        this.setState({filter: event.target.value})
    }

    renderHeader() {
        return (
            <thead>
            <tr>
                <th rowSpan={2}>Nama</th>
                <th rowSpan={2}>NIP</th>
                <th colSpan={2}>Posisi Awal</th>
                <th colSpan={2}>Posisi Akhir</th>
                <th rowSpan={2}>Jabatan</th>
            </tr>
            <tr>
                <th>Pangkat</th>
                <th>Golongan</th>
                <th>Pangkat</th>
                <th>Golongan</th>
            </tr>
            </thead>

        )
    }

    masaKerja(o) {
        const pensiun = moment(o.tanggal_lahir).add(MAX_PENSIUN, 'years');
        let diff = moment(pensiun).diff(moment(o.tgl_sk_cpns), 'milliseconds')
        let duration = moment.duration(diff)
        return (
            <>
                {duration.years()} Tahun {duration.months()} Bulan
            </>
        )
    }

    usia(o) {
        let diff = moment().diff(moment(o.tanggal_lahir), 'milliseconds')
        let duration = moment.duration(diff)
        return (
            <>
                {duration.years()} Tahun {duration.months()} Bulan
            </>
        )
    }

    pangkatTerakhir(o, index) {
        if (0 === o.pangkats.length) return ''
        let pangkats = o.pangkats.filter(i => {
            if (!i) return false
            if (!i.pangkat_golongan) return false
            return "PENSIUN" !== i.pangkat_golongan.golongan.toUpperCase();
        })
        let counter = 0
        for (let last of pangkats) {
            if (counter === 0) {
                counter++
                continue
            }
            if (!last) return ''
            let pangkat_golongan = last.pangkat_golongan
            if (!pangkat_golongan) return ''
            if (0 === index) {
                return pangkat_golongan.golongan
            }
            return pangkat_golongan.nama
        }
    }

    pangkatAjuan(o, index) {
        if (0 === o.pangkats.length) return ''
        let pangkats = o.pangkats.filter(i => {
            if (!i) return false
            if (!i.pangkat_golongan) return false
            return "PENSIUN" !== i.pangkat_golongan.golongan.toUpperCase();
        })
        for (let last of pangkats) {
            if (!last) return ''
            let pangkat_golongan = last.pangkat_golongan
            if (!pangkat_golongan) return ''
            if (0 === index) {
                return pangkat_golongan.golongan
            }
            return pangkat_golongan.nama
        }
    }

    downloadBlanko(o, index) {
        return (
            <a href="#" style={{marginTop: -10}}
               onClick={() => {
                   const {user} = this.state
                   fetch(BASE_URL + '/user/download/pensiun/' + o.nip + '/' + index)
                       .then(response => {
                           if (response.ok) {
                               response.blob().then(blob => {
                                   let url = window.URL.createObjectURL(blob);
                                   let a = document.createElement('a');
                                   a.href = url;
                                   a.download = o.nip + '-blanko-' + index + '.pdf';
                                   a.click();
                               });
                           }
                       }).catch(function (err) {
                   });
               }}>download</a>
        )
    }

    renderTable(users) {
        return (
            users.result.values.map((o, i) =>
                <tr className="clickable" key={i}>
                    <td>{o.nama}</td>
                    <td>{o.nip}</td>
                    <td>{this.pangkatTerakhir(o, 0)}</td>
                    <td>{this.pangkatTerakhir(o, 1)}</td>
                    <td>{this.pangkatAjuan(o, 0)}</td>
                    <td>{this.pangkatAjuan(o, 1)}</td>
                    <td>{o.jabatan}</td>
                </tr>
            )
        )
    }

    downloadEmployeeNaikPangkat() {
        fetch(BASE_URL + '/user/download/naikpangkat/' + this.state.year + '/' + this.state.month)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = 'Naik Pangkat Pegawai Periode' + this.state.year + '-' + this.state.month + '.pdf';
                    a.click();
                });
            });
    }

    handleChangeYearSelect(event) {
        const request = {
            filter: this.state.filter,
            year: event.value,
            month: this.state.month,
            module: 'naikpangkat',
            page: 0
        }
        this.props.pageUser(request)
        this.setState({year: event.value})
    }

    handleChangeMonthSelect(event) {
        const request = {
            filter: this.state.filter,
            year: this.state.year,
            month: event.value,
            module: 'naikpangkat',
            page: 0
        }
        this.props.pageUser(request)
        this.setState({month: event.value})
    }

    years() {
        let thisYear = moment().year();
        let first = moment().add(-38, 'years').year();
        let years = []
        for (let start = thisYear; start > (first); start--) {
            years.push({
                value: start,
                label: start
            })
        }
        return years
    }

    render() {
        const {page, filter, month, year} = this.state
        const {users} = this.props

        return (
            <Fragment>
                <div className="row">
                    <div className="col-md-12 grid-margin stretch-card">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="card-title">Data Pegawai Naik Pangkat</h4>
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group row">
                                                    <button type="submit" style={{marginTop: -10}}
                                                            onClick={this.downloadEmployeeNaikPangkat}
                                                            className="btn btn-success btn-sm mr-2 ">
                                                        <i className="mdi mdi-18px mdi-printer"/> Cetak
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9">
                                        <div className="row">
                                            <div className="col-md-3">
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label">Tahun</label>
                                                    <div className="col-sm-8">
                                                        <Select className="form-control select-tmd"
                                                                options={this.years()}
                                                                value={this.years().filter(function (option) {
                                                                    return option.value === year
                                                                })}
                                                                onChange={this.handleChangeYearSelect}
                                                                label="Single select"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label">Bulan</label>
                                                    <div className="col-sm-8">
                                                        <Select className="form-control select-tmd"
                                                                options={MONTHS}
                                                                value={MONTHS.filter(function (option) {
                                                                    return option.value === month
                                                                })}
                                                                onChange={this.handleChangeMonthSelect}
                                                                label="Single select"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="form-group row">
                                                    <label className="col-sm-4 col-form-label">Nama</label>
                                                    <div className="col-sm-8">
                                                        <input type="text" className="form-control"
                                                               value={this.state.filter}
                                                               onChange={this.handleChangeName}
                                                               placeholder="Nama pegawai"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        {this.renderHeader()}
                                        <tbody>
                                        {this.renderTable(users)}
                                        </tbody>

                                    </table>
                                </div>
                                <Pagination
                                    totalPages={users.result.page_total}
                                    currentPage={(page + 1)}
                                    showMax={5}
                                    onClick={this.changePage}
                                />

                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

function mapStateToProps(state) {
    return {
        users: (state[USER_PAGE_RESPONSE] ? state[USER_PAGE_RESPONSE] : emptyContentPage)
    }
}

export default connect(mapStateToProps, {pageUser, listDuk, paramDuk})(UserNaikPangkat);