/**
 * 微信小程序JavaScriptSDK
 * 
 * @version 1.2
 * @Author binsee, timler
 */

var ERROR_CONF = {
    KEY_ERR: 311,
    KEY_ERR_MSG: 'key格式错误',
    PARAM_ERR: 310,
    PARAM_ERR_MSG: '请求参数信息有误',
    SYSTEM_ERR: 600,
    SYSTEM_ERR_MSG: '系统错误',
    WX_ERR_CODE: 1000,
    WX_OK_CODE: 200
};
var BASE_URL = 'https://apis.map.qq.com/ws/';
var URL_SEARCH = BASE_URL + 'place/v1/search';
var URL_SUGGESTION = BASE_URL + 'place/v1/suggestion';
var URL_GET_GEOCODER = BASE_URL + 'geocoder/v1/';
var URL_CITY_LIST = BASE_URL + 'district/v1/list';
var URL_AREA_LIST = BASE_URL + 'district/v1/getchildren';
var URL_DISTANCE = BASE_URL + 'distance/v1/';
var URL_DIRECTION = BASE_URL + 'direction/v1/';
var Utils = {
    location2query(data) {
        if (typeof data == 'string') {
            return data;
        }
        var query = '';
        for (var i = 0; i < data.length; i++) {
            var d = data[i];
            if (!!query) {
                query += ';';
            }
            if (d.location) {
                query = query + d.location.lat + ',' + d.location.lng;
            }
            if (d.latitude && d.longitude) {
                query = query + d.latitude + ',' + d.longitude;
            }
        }
        return query;
    },

    rad(d) {
        return d * Math.PI / 180.0;
    },
    getDistance(latFrom, lngFrom, latTo, lngTo) {
        var radLatFrom = this.rad(latFrom);
        var radLatTo = this.rad(latTo);
        var a = radLatFrom - radLatTo;
        var b = this.rad(lngFrom) - this.rad(lngTo);
        var distance = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLatFrom) * Math.cos(radLatTo) * Math.pow(Math.sin(b / 2), 2)));
        distance = distance * 6378.137;
        distance = Math.round(distance * 10000) / 10000;
        return distance;
    },
    getWXLocation(success, fail, complete) {
        wx.getLocation({
            type: 'gcj02',
            success: success,
            fail: fail,
            complete: complete
        });
    },

    getLocationParam(location) {
        if (typeof location == 'string') {
            var locationArr = location.split(',');
            if (locationArr.length === 2) {
                location = {
                    latitude: location.split(',')[0],
                    longitude: location.split(',')[1]
                };
            } else {
                location = {};
            }
        }
        return location;
    },

    polyfillParam(param) {
        param.success = param.success || function () { };
        param.fail = param.fail || function () { };
        param.complete = param.complete || function () { };
    },

    checkParamKeyEmpty(param, key) {
        if (!param[key]) {
            var errconf = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + key + '参数格式有误');
            param.fail(errconf);
            param.complete(errconf);
            return true;
        }
        return false;
    },

    checkKeyword(param) {
        return !this.checkParamKeyEmpty(param, 'keyword');
    },

    checkLocation(param) {
        var location = this.getLocationParam(param.location);
        if (!location || !location.latitude || !location.longitude) {
            var errconf = this.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + ' location参数格式有误');
            param.fail(errconf);
            param.complete(errconf);
            return false;
        }
        return true;
    },

    buildErrorConfig(errCode, errMsg) {
        return {
            status: errCode,
            message: errMsg
        };
    },

    handleRes(param) {
        var that = this;
        return function (res) {
            if (res.statusCode == ERROR_CONF.WX_OK_CODE) {
                var data = res.data;
                if (data.status === 0) {
                    param.success(data);
                } else {
                    param.fail(data);
                }
            } else {
                param.fail(that.buildErrorConfig(ERROR_CONF.SYSTEM_ERR, ERROR_CONF.SYSTEM_ERR_MSG));
            }
            param.complete(res);
        };
    }
};

class QQMapWX {

    constructor(options) {
        if (!options.key) {
            throw Error('key值不能为空');
        }
        this.key = options.key;
    };

    search(options) {
        var that = this;
        options = options || {};

        Utils.polyfillParam(options);

        if (!Utils.checkKeyword(options)) {
            return;
        }

        var requestParam = {
            keyword: options.keyword,
            orderby: options.orderby || '_distance',
            page_size: options.page_size || 10,
            page_index: options.page_index || 1,
            output: 'json',
            key: that.key
        };

        if (options.address_format) {
            requestParam.address_format = options.address_format;
        }

        if (options.filter) {
            requestParam.filter = options.filter;
        }

        var location = Utils.getLocationParam(options.location);
        if (location.latitude && location.longitude) {
            requestParam.boundary = 'nearby(' + location.latitude + ',' + location.longitude + ',' + (options.radius || 1000) + (options.auto_extend == 0 ? ',0' : ',1') + ')';
        }

        wx.request({
            url: URL_SEARCH,
            data: requestParam,
            method: 'GET',
            success: Utils.handleRes(options),
            fail: function (res) {
                options.fail(Utils.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
                options.complete(res);
            }
        });
    };

    getSuggestion(options) {
        var that = this;
        options = options || {};
        Utils.polyfillParam(options);

        if (!Utils.checkKeyword(options)) {
            return;
        }

        var requestParam = {
            keyword: options.keyword,
            region: options.region || '全国',
            region_fix: options.region_fix || 0,
            policy: options.policy || 0,
            page_size: options.page_size || 10,
            page_index: options.page_index || 1,
            get_subpois: options.get_subpois || 0,
            output: 'json',
            key: that.key
        };
        if (options.address_format) {
            requestParam.address_format = options.address_format;
        }
        if (options.filter) {
            requestParam.filter = options.filter;
        }
        if (options.location) {
            var location = Utils.getLocationParam(options.location);
            requestParam.location = location.latitude + ',' + location.longitude;
        }

        wx.request({
            url: URL_SUGGESTION,
            data: requestParam,
            method: 'GET',
            success: Utils.handleRes(options),
            fail: function (res) {
                options.fail(Utils.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
                options.complete(res);
            }
        });
    };

    reverseGeocoder(options) {
        var that = this;
        options = options || {};
        Utils.polyfillParam(options);
        var requestParam = {
            coord_type: options.coord_type || 5,
            get_poi: options.get_poi || 0,
            output: 'json',
            key: that.key
        };
        if (options.poi_options) {
            requestParam.poi_options = options.poi_options;
        }

        var locationsuccess = function (result) {
            requestParam.location = result.latitude + ',' + result.longitude;
            wx.request({
                url: URL_GET_GEOCODER,
                data: requestParam,
                method: 'GET',
                success: Utils.handleRes(options),
                fail: function (res) {
                    options.fail(Utils.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
                    options.complete(res);
                }
            });
        };
        if (options.location) {
            var location = Utils.getLocationParam(options.location);
            if (location.latitude && location.longitude) {
                requestParam.location = location.latitude + ',' + location.longitude;
                wx.request({
                    url: URL_GET_GEOCODER,
                    data: requestParam,
                    method: 'GET',
                    success: Utils.handleRes(options),
                    fail: function (res) {
                        options.fail(Utils.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
                        options.complete(res);
                    }
                });
            } else {
                options.fail(Utils.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + ' location参数格式有误'));
                options.complete(Utils.buildErrorConfig(ERROR_CONF.PARAM_ERR, ERROR_CONF.PARAM_ERR_MSG + ' location参数格式有误'));
            }
        } else {
            Utils.getWXLocation(locationsuccess, options.fail, options.complete);
        }
    };

    geocoder(options) {
        var that = this;
        options = options || {};
        Utils.polyfillParam(options);

        if (Utils.checkParamKeyEmpty(options, 'address')) {
            return;
        }

        var requestParam = {
            address: options.address,
            output: 'json',
            key: that.key
        };

        if (options.region) {
            requestParam.region = options.region;
        }

        wx.request({
            url: URL_GET_GEOCODER,
            data: requestParam,
            method: 'GET',
            success: Utils.handleRes(options),
            fail: function (res) {
                options.fail(Utils.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
                options.complete(res);
            }
        });
    };

    getCityList(options) {
        var that = this;
        options = options || {};
        Utils.polyfillParam(options);
        var requestParam = {
            output: 'json',
            key: that.key
        };

        wx.request({
            url: URL_CITY_LIST,
            data: requestParam,
            method: 'GET',
            success: Utils.handleRes(options),
            fail: function (res) {
                options.fail(Utils.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
                options.complete(res);
            }
        });
    };

    getDistrictByCityId(options) {
        var that = this;
        options = options || {};
        Utils.polyfillParam(options);

        if (Utils.checkParamKeyEmpty(options, 'id')) {
            return;
        }

        var requestParam = {
            id: options.id || '',
            output: 'json',
            key: that.key
        };

        wx.request({
            url: URL_AREA_LIST,
            data: requestParam,
            method: 'GET',
            success: Utils.handleRes(options),
            fail: function (res) {
                options.fail(Utils.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
                options.complete(res);
            }
        });
    };

    calculateDistance(options) {
        var that = this;
        options = options || {};
        Utils.polyfillParam(options);

        if (Utils.checkParamKeyEmpty(options, 'to')) {
            return;
        }

        var requestParam = {
            mode: options.mode || 'walking',
            to: Utils.location2query(options.to),
            output: 'json',
            key: that.key
        };

        if (options.from) {
            options.location = options.from;
        }

        var locationsuccess = function (result) {
            requestParam.from = result.latitude + ',' + result.longitude;
            wx.request({
                url: URL_DISTANCE,
                data: requestParam,
                method: 'GET',
                success: Utils.handleRes(options),
                fail: function (res) {
                    options.fail(Utils.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
                    options.complete(res);
                }
            });
        };

        if (options.location) {
            var location = Utils.getLocationParam(options.location);
            if (location.latitude && location.longitude) {
                requestParam.from = location.latitude + ',' + location.longitude;
                wx.request({
                    url: URL_DISTANCE,
                    data: requestParam,
                    method: 'GET',
                    success: Utils.handleRes(options),
                    fail: function (res) {
                        options.fail(Utils.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
                        options.complete(res);
                    }
                });
            }
        } else {
            Utils.getWXLocation(locationsuccess, options.fail, options.complete);
        }
    };

    direction(options) {
        var that = this;
        options = options || {};
        Utils.polyfillParam(options);

        if (Utils.checkParamKeyEmpty(options, 'to')) {
            return;
        }

        var requestParam = {
            mode: options.mode || 'driving',
            to: Utils.location2query(options.to),
            output: 'json',
            key: that.key
        };

        if (options.from) {
            options.location = options.from;
        }

        if (options.from_poi) {
            requestParam.from_poi = options.from_poi;
        }

        if (options.heading) {
            requestParam.heading = options.heading;
        }

        if (options.speed) {
            requestParam.speed = options.speed;
        }

        if (options.accuracy) {
            requestParam.accuracy = options.accuracy;
        }

        if (options.road_type) {
            requestParam.road_type = options.road_type;
        }

        if (options.to_poi) {
            requestParam.to_poi = options.to_poi;
        }

        if (options.from_track) {
            requestParam.from_track = options.from_track;
        }

        if (options.waypoints) {
            requestParam.waypoints = Utils.location2query(options.waypoints);
        }

        if (options.policy) {
            requestParam.policy = options.policy;
        }

        if (options.plate_number) {
            requestParam.plate_number = options.plate_number;
        }

        var locationsuccess = function (result) {
            requestParam.from = result.latitude + ',' + result.longitude;
            wx.request({
                url: URL_DIRECTION + requestParam.mode,
                data: requestParam,
                method: 'GET',
                success: Utils.handleRes(options),
                fail: function (res) {
                    options.fail(Utils.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
                    options.complete(res);
                }
            });
        };

        if (options.location) {
            var location = Utils.getLocationParam(options.location);
            if (location.latitude && location.longitude) {
                requestParam.from = location.latitude + ',' + location.longitude;
                wx.request({
                    url: URL_DIRECTION + requestParam.mode,
                    data: requestParam,
                    method: 'GET',
                    success: Utils.handleRes(options),
                    fail: function (res) {
                        options.fail(Utils.buildErrorConfig(ERROR_CONF.WX_ERR_CODE, res.errMsg));
                        options.complete(res);
                    }
                });
            }
        } else {
            Utils.getWXLocation(locationsuccess, options.fail, options.complete);
        }
    };
}

module.exports = QQMapWX;
