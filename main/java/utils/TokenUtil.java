package com.minzu.utils;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

public class TokenUtil {
    private static final String SECRET = "minzu_law_secret_2024";
    private static final long EXPIRE = 86400000; // 24小时

    public static String generateToken(Integer userId) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE))
                .signWith(SignatureAlgorithm.HS512, SECRET)
                .compact();
    }

    public static Integer getUserIdFromToken(String token) {
        try {
            String subject = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody().getSubject();
            return Integer.parseInt(subject);
        } catch (Exception e) {
            return null;
        }
    }
}