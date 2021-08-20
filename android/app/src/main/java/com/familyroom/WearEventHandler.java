package com.familyroom;

import android.util.Log;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class WearEventHandler {
    private ReactApplicationContext mContext;
    private final String tag = WearEventHandler.class.getName();
    public WearEventHandler(ReactApplicationContext ctx) {
        mContext = ctx;
    }
    public void onEvent(){
        this.emitEvent(null);
    }

    private void emitEvent(@Nullable String msg){
        Log.d(tag , "Emiting message");
        mContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("test" , msg);
    }
}
