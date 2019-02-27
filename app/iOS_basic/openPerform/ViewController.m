//
//  ViewController.m
//  native-xcode-node-folder
//
//  Created by Jaime Bernardo on 08/03/2018.
//  Modified by Travis Bennett on 02/25/2019
//  Copyright © 2018 Janea Systems. All rights reserved.
//

#import "ViewController.h"
#import <WebKit/WebKit.h>

@interface ViewController ()
@property(strong,nonatomic) WKWebView *webView;
@property (strong, nonatomic) NSString *productURL;
@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
   
    // load url after a delay
    [self performSelector:@selector(loadURL:) withObject:nil afterDelay:0.5]; // wait for node server to initialize before loading the page
}

-(void)loadURL:(id)sender{
    // init web view
    WKWebViewConfiguration *theConfiguration = [[WKWebViewConfiguration alloc] init];
    WKWebView *webView = [[WKWebView alloc] initWithFrame:self.view.frame configuration:theConfiguration];
    self.webView = webView;
    self.webView.hidden = true;
    
    // add web view to page
    [self.view addSubview:self.webView];
    
    NSURL *nsurl=[NSURL URLWithString:@"http://127.0.0.1:8080/"];
    NSURLRequest *nsrequest=[NSURLRequest requestWithURL:nsurl];
    
    [self.webView loadRequest:nsrequest];
    [self.webView addObserver:self forKeyPath:@"loading" options:NSKeyValueObservingOptionNew context:nil];
    [self.webView addObserver:self forKeyPath:@"estimatedProgress" options:NSKeyValueObservingOptionNew context:nil];
}

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context{
    if ([keyPath isEqualToString:@"loading"]) {
        if (!self.webView.isLoading) {
            // Finished loading.
            self.webView.hidden = false;
        }
        
    }
    else if ([keyPath isEqualToString:@"estimatedProgress"]){
        float progress = _webView.estimatedProgress; // Do whatever you want with the progress
    }
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
