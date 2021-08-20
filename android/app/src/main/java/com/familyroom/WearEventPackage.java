package com.familyroom;

import androidx.annotation.NonNull;

import com.facebook.react.ReactApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.module.annotations.ReactModule;

public class WearEventPackage extends ReactContextBaseJavaModule {
    public WearEventPackage(ReactApplicationContext context){
        super(context);
        WearEventHandler handler = new WearEventHandler(context);
        WearService.setHandler(handler);
    }
    @NonNull
    @Override
    public String getName() {
        return "WearCom";
    }
}
