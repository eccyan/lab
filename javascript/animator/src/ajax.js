(function ( Animator ) {
Animator.ajax = function(obj){
    var url = obj.url || "",
        method = obj.method || "GET",
        data = obj.data || null,
        success = obj.success || function(){},
        error = obj.error || function(){},
        mimeType = obj.mimeType || null,
        xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200){
            success(xhr);
            }else{
            error();
            }
        }
    };
    if (mimeType) {
        xhr.overrideMimeType(mimeType);
    }
    xhr.send(data);
};
})( Animator );
