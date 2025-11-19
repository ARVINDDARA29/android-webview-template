package com.example.webview;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        WebView web = findViewById(R.id.webview);

        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);

        String url = getString(R.string.start_url);
        web.loadUrl(url);
    }
}
