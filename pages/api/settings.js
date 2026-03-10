import {mongooseConnect} from "@/lib/mongoose";
import {Settings} from "@/models/Settings";

export default async function handle(req, res) {
  try {
    await mongooseConnect();

    if (req.method === 'GET') {
      const settings = await Settings.find();
      const settingsObj = {};
      settings.forEach(setting => {
        settingsObj[setting.name] = setting.value;
      });
      res.json(settingsObj);
    } else {
      res.status(405).json({message: 'Method Not Allowed'});
    }
  } catch (error) {
    console.error('Error in settings API:', error);
    res.status(500).json({message: 'Internal server error', error: error.message});
  }
}
