package com.authentick.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;

@Service
public class QrCodeService {

    public byte[] generateQrCodeWithLabel(String data, String label) {
        try {
            int width = 500;
            int height = 500;
            int labelHeight = 60;
            
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix bitMatrix = writer.encode(data, BarcodeFormat.QR_CODE, width, height);
            
            java.awt.image.BufferedImage qrImage = MatrixToImageWriter.toBufferedImage(bitMatrix);
            java.awt.image.BufferedImage combined = new java.awt.image.BufferedImage(width, height + labelHeight, java.awt.image.BufferedImage.TYPE_INT_RGB);
            
            java.awt.Graphics2D g = combined.createGraphics();
            g.setColor(java.awt.Color.WHITE);
            g.fillRect(0, 0, width, height + labelHeight);
            g.drawImage(qrImage, 0, 0, null);
            
            g.setColor(java.awt.Color.BLACK);
            g.setFont(new java.awt.Font(java.awt.Font.SANS_SERIF, java.awt.Font.BOLD, 18));
            
            java.awt.FontMetrics metrics = g.getFontMetrics();
            int x = (width - metrics.stringWidth(label)) / 2;
            int y = height + (labelHeight / 2) + 5;
            
            g.drawString(label, x, y);
            g.dispose();
            
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            javax.imageio.ImageIO.write(combined, "PNG", outputStream);
            return outputStream.toByteArray();
        } catch (WriterException | IOException e) {
            throw new RuntimeException("Failed to generate labeled QR code", e);
        }
    }

    public String generateQrCodeBase64(String data) {
        try {
            byte[] qrBytes = generateQrCodeWithLabel(data, "SCAN TO VERIFY");
            return Base64.getEncoder().encodeToString(qrBytes);
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }
}
