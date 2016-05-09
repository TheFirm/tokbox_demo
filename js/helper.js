TBAPP.helpers = {};

TBAPP.helpers.logError = function (error) {
    console.log("Error", error);
};

TBAPP.helpers.logIfError = function (error) {
    if(error){
        TBAPP.helpers.logError(error);
    }
};