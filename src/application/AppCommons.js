import {JENIS_CUTI} from "./AppConstant";
import moment from "moment";
import React from "react";
import ReactDOM from "react-dom";

export function cutiLabel(index) {
    return JENIS_CUTI.map((o, i) => {
        if (index === o.value) {
            return o.label;
        }
    })
}

export function formatDate(value) {
    if (null === value || undefined === value) return '-'
    return moment(value).format('DD-MM-YYYY')
}

export function formatStatusCuti(value) {
    if (undefined === value) return <label className="badge badge-info">Unknown</label>
    if (value === 1 || value === 2) {
        return <label className="badge badge-warning">In progress</label>
    } else return <label className="badge badge-success">Success</label>
    // return <label className="badge badge-danger">Suspend</label>
}

export function usernameTrim(value) {
    if (null === value || undefined === value) return 'Unknown'
    const max = 18
    if (value.length > max) {
        return value.substr(0, max - 3).concat("...");
    }
    return value
}

export function jabatanTrim(value) {
    if (null === value || undefined === value) return 'Unknown'
    const max = 15
    if (value.length > max) {
        return value.substr(0, max - 3).concat("...");
    }
    return value
}

export function clearInput(domRef) {
    const native = (element, value) => {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set
        const prototype = Object.getPrototypeOf(element)
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set
        if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value)
        } else {
            valueSetter.call(element, value)
        }
    }
    var node = ReactDOM.findDOMNode(domRef.current)
    if (node instanceof HTMLElement) {
        const element = node.querySelector('input')
        var event = new Event('input', {bubbles: true});
        native(element, null)
        element.dispatchEvent(event)
        console.log("trigger event")
    }

}

// siable before and weekend
export function disableBeforeDay(current) {
    const today = moment();
    return current.isAfter(today) && current.day() !== 0 && current.day() !== 6;

}