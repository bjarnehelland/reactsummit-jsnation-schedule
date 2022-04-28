import { getSchedule } from "../../data/schedule";

export default async function handler(req, res) {
  const data = await getSchedule();
  res.status(200).json(data);
}
