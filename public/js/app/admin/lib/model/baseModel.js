define(
    [],
    function () {
        return {
            parseModel: function (data) {
                if (data.success) {
                    data = data.data;
                }
                return data;
            },
            parseModels: function (data) {
                return data.data ? data.data : [];
            },
            simpleUploaded: function (name, value) {
                this.attr(name, value);
            },
            simpleRemoveUploaded: function (name) {
                this.attr(name, undefined);
            }
        }
    }
);
