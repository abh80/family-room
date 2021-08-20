package com.familyroom;

import android.util.Log;

import com.google.android.gms.wearable.MessageEvent;
import com.google.android.gms.wearable.WearableListenerService;

public class WearService extends WearableListenerService {
    private final String tag = WearService.class.getName();
    private static WearEventHandler handler;

    public static void setHandler(WearEventHandler handler1) {
        handler = handler1;
    }

    @Override
    public void onMessageReceived(MessageEvent messageEvent) {
        Log.d(tag, "Message Incoming: " + messageEvent.getPath());
        if (handler != null) handler.onEvent();
    }
}
