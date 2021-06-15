---
sidebar_label: "Telegram"
sidebar_position: 1
---


# Parser Telegram

парсит выгруженную историю из html в json

```typescript
type Message = {
  id: number, // message_id
  name: string,
  text: string,
  reply: number | null, // message_id
  date: Date,
}
```