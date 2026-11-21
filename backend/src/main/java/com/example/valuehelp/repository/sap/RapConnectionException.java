package com.example.valuehelp.repository.sap;

/** SAP 통신 또는 OData 응답 오류. 상세 응답이나 인증정보는 클라이언트에 노출하지 않는다. */
public class RapConnectionException extends RuntimeException {
    public RapConnectionException(String message) { super(message); }
    public RapConnectionException(String message, Throwable cause) { super(message, cause); }
}
