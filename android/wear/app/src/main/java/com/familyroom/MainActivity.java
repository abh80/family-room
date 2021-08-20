package com.familyroom;


import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.localbroadcastmanager.content.LocalBroadcastManager;


import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;

import com.google.android.gms.tasks.Task;
import com.google.android.gms.tasks.Tasks;
import com.google.android.gms.wearable.Node;
import com.google.android.gms.wearable.Wearable;

import java.util.List;
import java.util.concurrent.ExecutionException;


public class MainActivity extends AppCompatActivity {

    private final String tag = MainActivity.class.getName();
    private final String message_path = "/message_data";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        getSupportFragmentManager()
                .beginTransaction().replace(R.id.fragment_manager, Main.class, null).commit();
        new Thread(new Runnable() {
            @Override
            public void run() {
                new Send(message_path, "kek").send();
            }
        }).start();
    }

    public void onMessage(final String msg) {
        Log.d(tag, msg);
        new Thread(new Runnable() {
            @Override
            public void run() {
                new Send(message_path, msg);
            }
        }).start();
    }

    class Send extends Thread {
        private String message;
        private String path;
        private Context context;

        Send(String npath, @Nullable String nmessage) {
            path = npath;
            message = nmessage;
            context = getApplicationContext();
        }

        public void send() {
            Log.d("Sender", "Attempting to send messages");
            Task<List<Node>> nodesTaskList = Wearable.getNodeClient(context).getConnectedNodes();
            try {
                List<Node> nodes = Tasks.await(nodesTaskList);

                for (Node node :
                        nodes) {
                    Task<Integer> sendMessageTask = Wearable.getMessageClient(context).sendMessage(node.getId(), path, message.getBytes());
                    try {
                        Integer result = Tasks.await(sendMessageTask);
                        Log.v("Sender", "Message sent to: " + node.getDisplayName());
                    } catch (ExecutionException | InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            } catch (ExecutionException | InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}





