#include <iostream>
#include <thread>
#include <chrono>
#include <random>

int main() {
    double price = 6527.27;
    std::default_random_engine gen;
    std::uniform_real_distribution<double> dist(-1.2, 1.2);

    while (true) {
        double open = price;
        double close = open + dist(gen);
        double high = std::max(open, close) + 0.4;
        double low = std::min(open, close) - 0.4;
        price = close;

        std::cout << "{\"spx\":" << close 
                  << ", \"nikkei\": 51063.72, \"usdjpy\": 158.80, \"oil\": 107.46, \"vix\": 17.5"
                  << ", \"candle\": {\"open\":" << open << ",\"high\":" << high 
                  << ",\"low\":" << low << ",\"close\":" << close << "}}" << std::endl;
        
        std::this_thread::sleep_for(std::chrono::milliseconds(800));
    }
    return 0;
}
