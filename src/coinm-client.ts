import { AxiosRequestConfig } from 'axios';
import {
  CoinMAccountTradeParams,
  CoinMOpenInterest,
  CoinMPositionTrade,
  CoinMSymbolOrderBookTicker,
  PositionRisk,
  SymbolOrPair,
} from './types/coin';
import {
  CancelAllOpenOrdersResult,
  CancelFuturesOrderResult,
  CancelMultipleOrdersParams,
  CancelOrdersTimeoutParams,
  ForceOrderResult,
  FuturesAccountBalance,
  FuturesAccountInformation,
  FuturesOrderBook,
  GetForceOrdersParams,
  GetIncomeHistoryParams,
  GetPositionMarginChangeHistoryParams,
  IncomeHistory,
  ModeChangeResult,
  NewFuturesOrderParams,
  NewOrderError,
  NewOrderResult,
  OrderResult,
  RebateDataOverview,
  SetCancelTimeoutResult,
  SetIsolatedMarginParams,
  SetIsolatedMarginResult,
  SetLeverageParams,
  SetLeverageResult,
  SetMarginTypeParams,
  SymbolLeverageBracketsResult,
} from './types/futures';
import {
  BasicSymbolParam,
  BinanceBaseUrlKey,
  CancelOCOParams,
  CancelOrderParams,
  GenericCodeMsgError,
  GetAllOrdersParams,
  GetOrderParams,
  NewOCOParams,
  OrderBookParams,
  OrderIdProperty,
} from './types/shared';
import BaseRestClient from './util/BaseRestClient';
import {
  asArray,
  generateNewOrderId,
  getOrderIdPrefix,
  getServerTimeEndpoint,
  logInvalidOrderId,
  RestClientOptions,
} from './util/requestUtils';

export class CoinMClient extends BaseRestClient {
  private clientId: BinanceBaseUrlKey;

  constructor(
    restClientOptions: RestClientOptions = {},
    requestOptions: AxiosRequestConfig = {},
    useTestnet?: boolean
  ) {
    const clientId = useTestnet ? 'coinmtest' : 'coinm';

    super(clientId, restClientOptions, requestOptions);

    this.clientId = clientId;
    return this;
  }

  /**
   * Abstraction required by each client to aid with time sync / drift handling
   */
  async getServerTime(): Promise<number> {
    return this.get(getServerTimeEndpoint(this.clientId)).then(
      (response) => response.serverTime
    );
  }

  getFuturesUserDataListenKey(): Promise<{ listenKey: string }> {
    return this.post('dapi/v1/listenKey');
  }

  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#change-log
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#general-info
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#testnet
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#general-api-information
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#limits
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#endpoint-security-type
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#signed-trade-and-user_data-endpoint-security
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#public-endpoints-info
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#filters
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#market-data-endpoints
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#test-connectivity
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#check-server-time
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#exchange-information
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#order-book
  getOrderBook(params: OrderBookParams): Promise<FuturesOrderBook> {
    return this.get('dapi/v1/depth', params);
  }
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#recent-trades-list
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#old-trades-lookup-market_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#compressed-aggregate-trades-list
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#index-price-and-mark-price
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#get-funding-rate-history-of-perpetual-futures
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#kline-candlestick-data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#continuous-contract-kline-candlestick-data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#index-price-kline-candlestick-data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#mark-price-kline-candlestick-data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#24hr-ticker-price-change-statistics
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#symbol-price-ticker

  getSymbolOrderBookTicker(
    params?: SymbolOrPair
  ): Promise<CoinMSymbolOrderBookTicker[]> {
    return this.get('dapi/v1/ticker/bookTicker', params).then((e) =>
      asArray(e)
    );
  }

  getOpenInterest(params: { symbol: string }): Promise<CoinMOpenInterest> {
    return this.get('dapi/v1/openInterest', params);
  }

  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#open-interest-statistics
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#top-trader-long-short-ratio-accounts
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#top-trader-long-short-ratio-positions
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#long-short-ratio
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#taker-buy-sell-volume
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#basis
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#websocket-market-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#live-subscribing-unsubscribing-to-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#aggregate-trade-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#index-price-stream
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#mark-price-stream
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#mark-price-of-all-symbols-of-a-pair
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#kline-candlestick-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#continuous-contract-kline-candlestick-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#index-kline-candlestick-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#mark-price-kline-candlestick-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#individual-symbol-mini-ticker-stream
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#all-market-mini-tickers-stream
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#individual-symbol-ticker-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#all-market-tickers-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#individual-symbol-book-ticker-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#all-book-tickers-stream
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#liquidation-order-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#all-market-liquidation-order-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#partial-book-depth-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#diff-book-depth-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#how-to-manage-a-local-order-book-correctly
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#account-trades-endpoints
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#new-future-account-transfer
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#get-future-account-transaction-history-list
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#change-position-mode-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#get-current-position-mode-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#new-order-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#modify-order-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#place-multiple-orders-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#modify-multiple-orders-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#get-order-modify-history-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#query-order-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#cancel-order-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#cancel-all-open-orders-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#cancel-multiple-orders-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#auto-cancel-all-open-orders-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#query-current-open-order-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#current-all-open-orders-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#all-orders-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#futures-account-balance-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#account-information-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#change-initial-leverage-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#change-margin-type-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#modify-isolated-position-margin-trade
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#get-position-margin-change-history-trade

  getPositions(): Promise<PositionRisk[]> {
    return this.getPrivate('dapi/v1/positionRisk');
  }

  getAccountTrades(
    params: CoinMAccountTradeParams
  ): Promise<CoinMPositionTrade[]> {
    return this.getPrivate('dapi/v1/userTrades', params);
  }

  /**
   *
   * COIN-M-Futures Account/Trade Endpoints
   *
   **/
  submitNewOrder(
    params: NewFuturesOrderParams
  ): Promise<NewOrderResult | NewOrderError> {
    this.validateOrderId(params, 'newClientOrderId');
    return this.postPrivate('dapi/v1/order', params);
  }

  /**
   * Warning: max 5 orders at a time! This method does not throw, instead it returns individual errors in the response array if any orders were rejected.
   *
   * Known issue: `quantity` and `price` should be sent as strings
   */
  submitMultipleOrders(
    orders: NewFuturesOrderParams<string>[]
  ): Promise<(NewOrderResult | NewOrderError)[]> {
    const stringOrders = orders.map((order) => {
      const orderToStringify = { ...order };
      this.validateOrderId(orderToStringify, 'newClientOrderId');
      return JSON.stringify(orderToStringify);
    });
    const requestBody = {
      batchOrders: `[${stringOrders.join(',')}]`,
    };
    return this.postPrivate('dapi/v1/batchOrders', requestBody);
  }

  getOrder(params: GetOrderParams): Promise<OrderResult> {
    return this.getPrivate('dapi/v1/order', params);
  }

  cancelOrder(params: CancelOrderParams): Promise<CancelFuturesOrderResult> {
    return this.deletePrivate('dapi/v1/order', params);
  }

  cancelAllOpenOrders(
    params: BasicSymbolParam
  ): Promise<CancelAllOpenOrdersResult> {
    return this.deletePrivate('dapi/v1/allOpenOrders', params);
  }

  cancelMultipleOrders(
    params: CancelMultipleOrdersParams
  ): Promise<(CancelFuturesOrderResult | GenericCodeMsgError)[]> {
    return this.deletePrivate('dapi/v1/batchOrders', params);
  }

  // Auto-cancel all open orders
  setCancelOrdersOnTimeout(
    params: CancelOrdersTimeoutParams
  ): Promise<SetCancelTimeoutResult> {
    return this.postPrivate('dapi/v1/countdownCancelAll', params);
  }

  getCurrentOpenOrder(params: GetOrderParams): Promise<OrderResult> {
    return this.getPrivate('dapi/v1/openOrder', params);
  }

  getAllOpenOrders(params?: Partial<BasicSymbolParam>): Promise<OrderResult[]> {
    return this.getPrivate('dapi/v1/openOrders', params);
  }

  getAllOrders(params: GetAllOrdersParams): Promise<OrderResult[]> {
    return this.getPrivate('dapi/v1/allOrders', params);
  }

  getBalance(): Promise<FuturesAccountBalance[]> {
    return this.getPrivate('dapi/v2/balance');
  }

  getAccountInformation(): Promise<FuturesAccountInformation> {
    return this.getPrivate('dapi/v2/account');
  }

  setLeverage(params: SetLeverageParams): Promise<SetLeverageResult> {
    return this.postPrivate('dapi/v1/leverage', params);
  }

  setMarginType(params: SetMarginTypeParams): Promise<ModeChangeResult> {
    return this.postPrivate('dapi/v1/marginType', params);
  }

  setIsolatedPositionMargin(
    params: SetIsolatedMarginParams
  ): Promise<SetIsolatedMarginResult> {
    return this.postPrivate('dapi/v1/positionMargin', params);
  }

  getPositionMarginChangeHistory(
    params: GetPositionMarginChangeHistoryParams
  ): Promise<any> {
    return this.getPrivate('dapi/v1/positionMargin/history', params);
  }

  getIncomeHistory(params?: GetIncomeHistoryParams): Promise<IncomeHistory[]> {
    return this.getPrivate('dapi/v1/income', params);
  }

  getNotionalAndLeverageBrackets(
    params?: Partial<BasicSymbolParam>
  ): Promise<SymbolLeverageBracketsResult[] | SymbolLeverageBracketsResult> {
    return this.getPrivate('dapi/v1/leverageBracket', params);
  }

  getADLQuantileEstimation(params?: Partial<BasicSymbolParam>): Promise<any> {
    return this.getPrivate('dapi/v1/adlQuantile', params);
  }

  getForceOrders(params?: GetForceOrdersParams): Promise<ForceOrderResult[]> {
    return this.getPrivate('dapi/v1/forceOrders', params);
  }

  getApiQuantitativeRulesIndicators(
    params?: Partial<BasicSymbolParam>
  ): Promise<any> {
    return this.getPrivate('dapi/v1/apiTradingStatus', params);
  }

  getAccountComissionRate(
    params: BasicSymbolParam
  ): Promise<RebateDataOverview> {
    return this.getPrivate('dapi/v1/commissionRate', params);
  }

  /**
   * Validate syntax meets requirements set by binance. Log warning if not.
   */
  private validateOrderId(
    params:
      | NewFuturesOrderParams
      | CancelOrderParams
      | NewOCOParams
      | CancelOCOParams,
    orderIdProperty: OrderIdProperty
  ): void {
    const apiCategory = this.clientId;
    if (!params[orderIdProperty]) {
      params[orderIdProperty] = generateNewOrderId(apiCategory);
      return;
    }

    const expectedOrderIdPrefix = `x-${getOrderIdPrefix(apiCategory)}`;
    if (!params[orderIdProperty].startsWith(expectedOrderIdPrefix)) {
      logInvalidOrderId(orderIdProperty, expectedOrderIdPrefix, params);
    }
  }

  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#get-income-history-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#notional-bracket-for-symbol-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#notional-bracket-for-pair-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#user-39-s-force-orders-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#position-adl-quantile-estimation-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#user-commission-rate-user_data
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#user-data-streams
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#start-user-data-stream-user_stream
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#keepalive-user-data-stream-user_stream
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#close-user-data-stream-user_stream
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#event-margin-call
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#event-balance-and-position-update
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#event-order-update
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#websocket-user-data-request
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#request-user-39-s-account-information
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#request-user-39-s-account-balance
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#request-user-39-s-position
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#event-account-configuration-update-leverage-update
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#portfolio-margin-endpoints
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#portfolio-margin-exchange-information
  //TODO - https://binance-docs.github.io/apidocs/delivery/en/#portfolio-margin-account-information-user_data
}
