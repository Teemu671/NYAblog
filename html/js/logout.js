const logout = () => {
    document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });


    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login page
    //router.push("/login",{"message":"Invalid login."})
};
