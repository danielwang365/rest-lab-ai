import logging
import json

from dotenv import load_dotenv
from livekit.agents import (
    NOT_GIVEN,
    Agent,
    AgentFalseInterruptionEvent,
    AgentSession,
    JobContext,
    JobProcess,
    MetricsCollectedEvent,
    RoomInputOptions,
    RunContext,
    WorkerOptions,
    cli,
    metrics,
)
from livekit.agents.llm import function_tool
from livekit.plugins import deepgram, noise_cancellation, openai, silero
from livekit.plugins.turn_detector.multilingual import MultilingualModel

from prompts import THERAPIST_PROMPT

logger = logging.getLogger("agent")

load_dotenv(".env.local")


class Therapist(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=THERAPIST_PROMPT,
        )
        self._room = None  # Will be set when session starts
    
    def set_room(self, room):
        """Set the room reference for function tools to use"""
        self._room = room

    # all functions annotated with @function_tool will be passed to the LLM when this
    # agent is active
    
    # @function_tool
    # async def lookup_weather(self, context: RunContext, location: str):
    #     """Use this tool to look up current weather information in the given location.

    #     If the location is not supported by the weather service, the tool will indicate this. You must tell the user the location's weather is unavailable.

    #     Args:
    #         location: The location to look up weather information for (e.g. city name)
    #     """

    #     logger.info(f"Looking up weather for {location}")

    #     return "sunny with a temperature of 70 degrees."

    @function_tool
    async def log_pain_assessment(self, context: RunContext, pain_level: int, pain_location: str, pain_quality: str, triggers: str = "", coping_strategies: str = ""):
        """Use this tool to record comprehensive pain metrics for chronic pain monitoring.

        This tool helps track pain patterns and management effectiveness as part of therapeutic care.

        Args:
            pain_level: Current pain level on a scale of 1-10 (1 = minimal, 10 = severe)
            pain_location: Where the pain is located (e.g., "lower back", "neck and shoulders", "widespread")
            pain_quality: Description of pain type (e.g., "sharp", "dull", "burning", "throbbing", "aching")
            triggers: Optional. What may have triggered or worsened the pain (e.g., "weather change", "stress", "activity")
            coping_strategies: Optional. Current pain management strategies being used (e.g., "heat therapy", "medication", "breathing exercises")
        """

        logger.info(f"Logging pain assessment: Level {pain_level}, Location: {pain_location}, Quality: {pain_quality}")

        assessment_data = {
            "painLevel": pain_level,
            "location": pain_location,
            "quality": pain_quality,
            "triggers": triggers,
            "copingStrategies": coping_strategies,
        }

        # Send data to frontend via room data channel
        try:
            message = {
                "type": "pain_assessment",
                "data": assessment_data
            }
            await self._room.local_participant.publish_data(
                json.dumps(message).encode(),
                reliable=True
            )
        except Exception as e:
            logger.error(f"❌ Failed to send pain assessment to frontend: {e}")

        return f"Pain assessment recorded successfully. Level: {pain_level}/10, Location: {pain_location}, Quality: {pain_quality}. This information will be available for your healthcare provider review."

    @function_tool
    async def track_sleep_quality(self, context: RunContext, sleep_quality: int, hours_slept: float, sleep_onset_minutes: int = 0, wake_ups: int = 0, sleep_factors: str = ""):
        """Use this tool to monitor sleep patterns and quality for patients with chronic pain and sleep disorders.

        Sleep tracking is essential for understanding the relationship between pain, sleep, and overall wellbeing.

        Args:
            sleep_quality: Overall sleep quality rating on a scale of 1-10 (1 = very poor, 10 = excellent)
            hours_slept: Total hours of sleep obtained (e.g., 6.5, 7.0)
            sleep_onset_minutes: Optional. Minutes it took to fall asleep (default: 0 if not specified)
            wake_ups: Optional. Number of times awakened during the night (default: 0)
            sleep_factors: Optional. Factors that affected sleep (e.g., "pain flare", "anxiety", "medication change", "good sleep hygiene")
        """

        logger.info(f"Tracking sleep quality: {sleep_quality}/10, Hours: {hours_slept}, Wake-ups: {wake_ups}")

        sleep_data = {
            "sleepQuality": sleep_quality,
            "hoursSlept": hours_slept,
            "sleepOnsetMinutes": sleep_onset_minutes,
            "wakeUps": wake_ups,
            "sleepFactors": sleep_factors,
        }

        # Send data to frontend via room data channel
        try:
            message = {
                "type": "sleep_quality",
                "data": sleep_data
            }
            await self._room.local_participant.publish_data(
                json.dumps(message).encode(),
                reliable=True
            )
        except Exception as e:
            logger.error(f"❌ Failed to send sleep quality to frontend: {e}")

        return f"Sleep data recorded successfully. Quality: {sleep_quality}/10, Duration: {hours_slept} hours, Wake-ups: {wake_ups}. This information helps track your sleep patterns and their relationship to pain management."

    @function_tool
    async def assess_mood_and_functioning(self, context: RunContext, mood_rating: int, energy_level: int, daily_activities_completion: int, social_engagement: int, emotional_coping: str = ""):
        """Use this tool to evaluate emotional wellbeing and daily functioning for comprehensive chronic pain care.

        This assessment helps monitor the psychological and functional impact of chronic conditions.

        Args:
            mood_rating: Current mood on a scale of 1-10 (1 = very low/depressed, 10 = very positive/happy)
            energy_level: Current energy level on a scale of 1-10 (1 = completely exhausted, 10 = very energetic)
            daily_activities_completion: Ability to complete daily activities on a scale of 1-10 (1 = unable to complete basic tasks, 10 = completed all planned activities)
            social_engagement: Level of social interaction/engagement on a scale of 1-10 (1 = completely isolated, 10 = very socially active)
            emotional_coping: Optional. Current emotional coping strategies being used (e.g., "mindfulness", "talking to friends", "journaling", "therapy techniques")
        """

        logger.info(f"Assessing mood and functioning: Mood {mood_rating}/10, Energy {energy_level}/10, Activities {daily_activities_completion}/10")

        functioning_data = {
            "moodRating": mood_rating,
            "energyLevel": energy_level,
            "dailyActivitiesCompletion": daily_activities_completion,
            "socialEngagement": social_engagement,
            "emotionalCoping": emotional_coping,
        }

        # Send data to frontend via room data channel
        try:
            message = {
                "type": "mood_assessment",
                "data": functioning_data
            }
            await self._room.local_participant.publish_data(
                json.dumps(message).encode(),
                reliable=True
            )
        except Exception as e:
            logger.error(f"❌ Failed to send mood assessment to frontend: {e}")

        return f"Mood and functioning assessment recorded. Mood: {mood_rating}/10, Energy: {energy_level}/10, Daily activities: {daily_activities_completion}/10, Social engagement: {social_engagement}/10. This holistic view supports your comprehensive care plan."


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


async def entrypoint(ctx: JobContext):
    # Logging setup
    # Add any other context you want in all log entries here
    ctx.log_context_fields = {
        "room": ctx.room.name,
    }

    # Set up a voice AI pipeline using OpenAI, Cartesia, Deepgram, and the LiveKit turn detector
    session = AgentSession(
        # A Large Language Model (LLM) is your agent's brain, processing user input and generating a response
        # See all providers at https://docs.livekit.io/agents/integrations/llm/
        llm=openai.LLM(model="gpt-4o-mini"),
        # Speech-to-text (STT) is your agent's ears, turning the user's speech into text that the LLM can understand
        # See all providers at https://docs.livekit.io/agents/integrations/stt/
        stt=deepgram.STT(model="nova-3", language="multi"),
        # Text-to-speech (TTS) is your agent's voice, turning the LLM's text into speech that the user can hear
        # See all providers at https://docs.livekit.io/agents/integrations/tts/
        tts=deepgram.TTS(model="aura-2-andromeda-en"),
        # VAD and turn detection are used to determine when the user is speaking and when the agent should respond
        # See more at https://docs.livekit.io/agents/build/turns
        turn_detection=MultilingualModel(),
        vad=ctx.proc.userdata["vad"],
        # allow the LLM to generate a response while waiting for the end of turn
        # See more at https://docs.livekit.io/agents/build/audio/#preemptive-generation
        preemptive_generation=True,
    )

    # To use a realtime model instead of a voice pipeline, use the following session setup instead:
    # session = AgentSession(
    #     # See all providers at https://docs.livekit.io/agents/integrations/realtime/
    #     llm=openai.realtime.RealtimeModel(voice="marin")
    # )

    # sometimes background noise could interrupt the agent session, these are considered false positive interruptions
    # when it's detected, you may resume the agent's speech
    @session.on("agent_false_interruption")
    def _on_agent_false_interruption(ev: AgentFalseInterruptionEvent):
        logger.info("false positive interruption, resuming")
        session.generate_reply(instructions=ev.extra_instructions or NOT_GIVEN)

    # Metrics collection, to measure pipeline performance
    # For more information, see https://docs.livekit.io/agents/build/metrics/
    usage_collector = metrics.UsageCollector()

    @session.on("metrics_collected")
    def _on_metrics_collected(ev: MetricsCollectedEvent):
        metrics.log_metrics(ev.metrics)
        usage_collector.collect(ev.metrics)

    async def log_usage():
        summary = usage_collector.get_summary()
        logger.info(f"Usage: {summary}")

    ctx.add_shutdown_callback(log_usage)

    # # Add a virtual avatar to the session, if desired
    # # For other providers, see https://docs.livekit.io/agents/integrations/avatar/
    # avatar = hedra.AvatarSession(
    #   avatar_id="...",  # See https://docs.livekit.io/agents/integrations/avatar/hedra
    # )
    # # Start the avatar and wait for it to join
    # await avatar.start(session, room=ctx.room)

    # Create the agent and set the room reference
    agent = Therapist()
    agent.set_room(ctx.room)
    
    # Start the session, which initializes the voice pipeline and warms up the models
    await session.start(
        agent=agent,
        room=ctx.room,
        room_input_options=RoomInputOptions(
            # LiveKit Cloud enhanced noise cancellation
            # - If self-hosting, omit this parameter
            # - For telephony applications, use `BVCTelephony` for best results
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

    # Join the room and connect to the user
    await ctx.connect()


if __name__ == "__main__":
    cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint, prewarm_fnc=prewarm))
