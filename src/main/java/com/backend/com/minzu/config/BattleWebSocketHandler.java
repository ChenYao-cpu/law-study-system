package com.backend.com.minzu.config;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.atomic.AtomicInteger;

@ServerEndpoint("/ws/battle/{userId}")
@Component
public class BattleWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(BattleWebSocketHandler.class);

    // 存储所有在线用户的WebSocket连接
    private static final Map<Long, Session> onlineUsers = new ConcurrentHashMap<>();

    // 存储匹配队列中的用户
    private static final CopyOnWriteArraySet<Long> matchingUsers = new CopyOnWriteArraySet<>();

    // 存储对战房间
    private static final Map<String, BattleRoom> battleRooms = new ConcurrentHashMap<>();

    // 在线用户数
    private static final AtomicInteger onlineCount = new AtomicInteger(0);

    @OnOpen
    public void onOpen(Session session, @PathParam("userId") Long userId) {
        onlineUsers.put(userId, session);
        onlineCount.incrementAndGet();
        log.info("用户 {} 已连接，当前在线人数: {}", userId, onlineCount.get());

        // 发送连接成功消息
        sendMessage(session, JSON.toJSONString(new Message("CONNECT_SUCCESS", "连接成功")));
    }

    @OnClose
    public void onClose(Session session, @PathParam("userId") Long userId) {
        onlineUsers.remove(userId);
        matchingUsers.remove(userId);
        onlineCount.decrementAndGet();
        log.info("用户 {} 已断开连接，当前在线人数: {}", userId, onlineCount.get());

        // 如果用户在对战中，通知对手
        notifyOpponent(userId, "OPPONENT_DISCONNECTED", "对手已断开连接");
    }

    @OnMessage
    public void onMessage(String message, @PathParam("userId") Long userId) {
        log.info("收到用户 {} 的消息: {}", userId, message);

        try {
            JSONObject msg = JSON.parseObject(message);
            String type = msg.getString("type");

            switch (type) {
                case "LOGIN":
                    handleLogin(userId, msg);
                    break;
                case "MATCH_START":
                    handleMatchStart(userId);
                    break;
                case "MATCH_CANCEL":
                    handleMatchCancel(userId);
                    break;
                case "ANSWER_SUBMIT":
                    handleAnswerSubmit(userId, msg);
                    break;
                case "HEARTBEAT":
                    handleHeartbeat(userId);
                    break;
                default:
                    log.warn("未知消息类型: {}", type);
            }
        } catch (Exception e) {
            log.error("处理消息失败", e);
            sendError(userId, "消息处理失败: " + e.getMessage());
        }
    }

    @OnError
    public void onError(Session session, Throwable error, @PathParam("userId") Long userId) {
        log.error("WebSocket错误，用户: {}", userId, error);
    }

    // 处理登录
    private void handleLogin(Long userId, JSONObject msg) {
        log.info("用户 {} 登录成功", userId);
    }

    // 处理开始匹配
    private void handleMatchStart(Long userId) {
        log.info("用户 {} 开始匹配", userId);

        matchingUsers.add(userId);

        // 发送匹配中状态
        sendMessage(userId, JSON.toJSONString(new Message("MATCH_STATUS", "匹配中...")));

        // 检查是否有其他等待匹配的用户
        for (Long otherUserId : matchingUsers) {
            if (!otherUserId.equals(userId)) {
                // 找到对手，创建对战房间
                createBattleRoom(userId, otherUserId);
                matchingUsers.remove(userId);
                matchingUsers.remove(otherUserId);
                return;
            }
        }
    }

    // 处理取消匹配
    private void handleMatchCancel(Long userId) {
        log.info("用户 {} 取消匹配", userId);
        matchingUsers.remove(userId);
        sendMessage(userId, JSON.toJSONString(new Message("MATCH_CANCELLED", "已取消匹配")));
    }

    // 处理答案提交
    private void handleAnswerSubmit(Long userId, JSONObject msg) {
        Integer questionIndex = msg.getInteger("questionIndex");
        Integer answerIndex = msg.getInteger("answerIndex");

        log.info("用户 {} 提交答案 - 题目{}: {}", userId, questionIndex, answerIndex);

        // 查找用户所在的房间
        BattleRoom room = null;
        Long opponentId = null;

        for (Map.Entry<String, BattleRoom> entry : battleRooms.entrySet()) {
            BattleRoom r = entry.getValue();
            if (r.player1.equals(userId)) {
                room = r;
                opponentId = r.player2;
                break;
            } else if (r.player2.equals(userId)) {
                room = r;
                opponentId = r.player1;
                break;
            }
        }

        if (room == null) {
            log.warn("用户 {} 不在任何对战房间中", userId);
            return;
        }

        // 记录答案
        room.recordAnswer(userId, questionIndex, answerIndex);

        // 通知对手
        if (opponentId != null) {
            JSONObject notification = new JSONObject();
            notification.put("type", "OPPONENT_ANSWER");
            notification.put("questionIndex", questionIndex);
            notification.put("answerIndex", answerIndex);
            notification.put("isCorrect", room.isAnswerCorrect(userId, questionIndex, answerIndex));

            sendMessage(opponentId, notification.toJSONString());
        }

        // 检查是否双方都完成了
        if (room.isBattleFinished()) {
            sendBattleResult(room);
        }
    }

    // 处理心跳
    private void handleHeartbeat(Long userId) {
        // 可以记录最后心跳时间
        log.debug("收到用户 {} 的心跳", userId);
    }

    // 创建对战房间
    private void createBattleRoom(Long player1, Long player2) {
        String roomId = "room_" + System.currentTimeMillis();
        BattleRoom room = new BattleRoom(roomId, player1, player2);
        battleRooms.put(roomId, room);

        log.info("创建对战房间 {}, 玩家: {} vs {}", roomId, player1, player2);

        // TODO: 从数据库加载题目（这里使用示例数据）
        JSONObject questions = new JSONObject();
        questions.put("type", "MATCH_SUCCESS");
        questions.put("battleId", roomId);
        questions.put("opponent", getPlayerInfo(player2));
        questions.put("questions", generateQuestions());

        // 通知两个玩家
        sendMessage(player1, questions.toJSONString());

        JSONObject player2Msg = new JSONObject();
        player2Msg.put("type", "MATCH_SUCCESS");
        player2Msg.put("battleId", roomId);
        player2Msg.put("opponent", getPlayerInfo(player1));
        player2Msg.put("questions", generateQuestions());
        sendMessage(player2, player2Msg.toJSONString());
    }

    // 发送对战结果
    private void sendBattleResult(BattleRoom room) {
        JSONObject result = new JSONObject();
        result.put("type", "BATTLE_FINISHED");
        result.put("player1Score", room.getPlayerScore(room.player1));
        result.put("player2Score", room.getPlayerScore(room.player2));
        result.put("winner", room.getWinner());

        sendMessage(room.player1, result.toJSONString());
        sendMessage(room.player2, result.toJSONString());

        // 清理房间
        battleRooms.remove(room.roomId);
    }

    // 通知对手
    private void notifyOpponent(Long userId, String type, String message) {
        for (BattleRoom room : battleRooms.values()) {
            if (room.player1.equals(userId)) {
                sendMessage(room.player2, JSON.toJSONString(new Message(type, message)));
            } else if (room.player2.equals(userId)) {
                sendMessage(room.player1, JSON.toJSONString(new Message(type, message)));
            }
        }
    }

    // 发送消息给指定用户
    private void sendMessage(Long userId, String message) {
        Session session = onlineUsers.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                log.error("发送消息失败，用户: {}", userId, e);
            }
        }
    }

    // 发送消息给Session
    private void sendMessage(Session session, String message) {
        if (session != null && session.isOpen()) {
            try {
                session.getBasicRemote().sendText(message);
            } catch (IOException e) {
                log.error("发送消息失败", e);
            }
        }
    }

    // 发送错误消息
    private void sendError(Long userId, String errorMsg) {
        JSONObject error = new JSONObject();
        error.put("type", "ERROR");
        error.put("message", errorMsg);
        sendMessage(userId, error.toJSONString());
    }

    // 获取玩家信息
    private JSONObject getPlayerInfo(Long userId) {
        JSONObject player = new JSONObject();
        player.put("userId", userId);
        player.put("nickname", "玩家" + userId);
        player.put("avatar", "/images/default_avatar.jpg");
        player.put("level", 1);
        return player;
    }

    // 生成题目（示例）
    private String generateQuestions() {
        return "[]"; // TODO: 从数据库加载真实题目
    }

    // 消息类
    private static class Message {
        private String type;
        private String message;

        public Message(String type, String message) {
            this.type = type;
            this.message = message;
        }

        public String getType() { return type; }
        public String getMessage() { return message; }
    }

    // 对战房间类
    private static class BattleRoom {
        String roomId;
        Long player1;
        Long player2;
        Map<Long, Map<Integer, Integer>> playerAnswers = new ConcurrentHashMap<>();
        Map<Long, Integer> playerScores = new ConcurrentHashMap<>();

        public BattleRoom(String roomId, Long player1, Long player2) {
            this.roomId = roomId;
            this.player1 = player1;
            this.player2 = player2;
            playerAnswers.put(player1, new ConcurrentHashMap<>());
            playerAnswers.put(player2, new ConcurrentHashMap<>());
            playerScores.put(player1, 0);
            playerScores.put(player2, 0);
        }

        public void recordAnswer(Long userId, Integer questionIndex, Integer answerIndex) {
            playerAnswers.get(userId).put(questionIndex, answerIndex);
            // TODO: 判断答案是否正确并计分
        }

        public boolean isAnswerCorrect(Long userId, Integer questionIndex, Integer answerIndex) {
            // TODO: 实现答案正确性判断
            return Math.random() > 0.5;
        }

        public int getPlayerScore(Long userId) {
            return playerScores.getOrDefault(userId, 0);
        }

        public boolean isBattleFinished() {
            // 简单判断：每人答了10题
            return playerAnswers.get(player1).size() >= 10 && playerAnswers.get(player2).size() >= 10;
        }

        public Long getWinner() {
            int score1 = playerScores.getOrDefault(player1, 0);
            int score2 = playerScores.getOrDefault(player2, 0);
            if (score1 > score2) return player1;
            if (score2 > score1) return player2;
            return null; // 平局
        }
    }
}
