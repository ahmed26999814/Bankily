package mr.bankily.app;

import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ImageView;

public class MainActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setStatusBarColor(Color.WHITE);
        getWindow().setNavigationBarColor(Color.WHITE);
        getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR
        );
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            getWindow().setStatusBarContrastEnforced(false);
            getWindow().setNavigationBarContrastEnforced(false);
        }

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.WHITE);
        root.setClipToPadding(true);
        root.setOnApplyWindowInsetsListener((view, windowInsets) -> {
            int top = windowInsets.getSystemWindowInsetTop();
            int bottom = windowInsets.getSystemWindowInsetBottom();
            view.setPadding(0, top, 0, bottom);
            return windowInsets;
        });

        webView = new WebView(this);
        webView.setBackgroundColor(Color.WHITE);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setTextZoom(100);
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setVisibility(View.INVISIBLE);

        ImageView splashLogo = new ImageView(this);
        splashLogo.setImageResource(R.drawable.bankily_logo);
        splashLogo.setScaleType(ImageView.ScaleType.FIT_CENTER);
        int horizontalPadding = (int) (34 * getResources().getDisplayMetrics().density);
        splashLogo.setPadding(horizontalPadding, 0, horizontalPadding, 0);
        splashLogo.setBackgroundColor(Color.WHITE);

        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        root.addView(splashLogo, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                webView.setVisibility(View.VISIBLE);
                splashLogo.animate().alpha(0f).setDuration(220).withEndAction(() -> {
                    root.removeView(splashLogo);
                }).start();
            }
        });

        setContentView(root);
        root.requestApplyInsets();
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        webView.evaluateJavascript(
                "(function(){" +
                "var drawer=document.getElementById('drawerOverlay');" +
                "var service=document.getElementById('serviceView');" +
                "var home=document.getElementById('homeView');" +
                "if(drawer&&drawer.classList.contains('open')){drawer.classList.remove('open');return 'handled';}" +
                "if(service&&service.classList.contains('active')){" +
                "service.classList.remove('active');home.classList.add('active');return 'handled';}" +
                "return 'not-handled';" +
                "})()",
                result -> {
                    if (!"\"handled\"".equals(result)) {
                        MainActivity.super.onBackPressed();
                    }
                }
        );
    }
}
