import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert, FlatList } from "react-native";
import { Button } from "../../components/Button";
import { ButtonIcon } from "../../components/ButtonIcon";
import { Filter } from "../../components/Filter";
import { Header } from "../../components/Header";
import { HighLight } from "../../components/HighLight";
import { Input } from "../../components/Input";
import { ListEmpty } from "../../components/ListEmpty";
import { PlayerCard } from "../../components/PlayerCard";
import { playerAddByGroup } from "../../storage/player/playerAddByGroup";
import { playerGetByGroup } from "../../storage/player/playerGetByGroup";
import { playerGetByGroupAndTeam } from "../../storage/player/playerGetByGroupAndTeam";
import { PlayerStorageDTO } from "../../storage/player/PlayerStorageDTO";
import { AppError } from "../../utils/AppError";
import { Container, Form, HeaderList, NumberOfPlayers } from "./styles";

type RouteParams = {
  group: string;
};

export function Players() {
  const [team, setTeam] = useState("");
  const [player, setPlayer] = useState<PlayerStorageDTO[]>([]);
  const [playerName, setPlayerName] = useState("");

  const route = useRoute();
  const { group } = route.params as RouteParams;

  async function handleAddNewPlayer() {
    if (playerName.trim().length === 0) {
      return Alert.alert("Please enter a player name");
    }

    const newPlayer = {
      name: playerName,
      team,
    };

    try {
      await playerAddByGroup(newPlayer, group);
      const players = await playerGetByGroup(group);
      setPlayer(players);
    } catch (err) {
      if (err instanceof AppError) {
        Alert.alert("Nova pessoa", err.message);
      } else {
        Alert.alert("Nova pessoa", "Nao foi possivel adicionar");
      }
    }
  }

  async function fetchPlayersByTeam() {
    try {
      const playersByTeam = await playerGetByGroupAndTeam(group, team);
      setPlayer(playersByTeam);
    } catch (err) {
      if (err instanceof AppError) {
        Alert.alert("Nova pessoa", "Nao foi possivel adicionar");
      }
    }
  }

  useEffect(() => {
    fetchPlayersByTeam();
  }, []);

  return (
    <Container>
      <Header showBackButton />

      <HighLight title={group} subtitle="Adicione a galera e separe os times" />
      <Form>
        <Input
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onChangeText={setPlayerName}
        />

        <ButtonIcon icon="add" onPress={handleAddNewPlayer} />
      </Form>
      <HeaderList>
        <FlatList
          data={team}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Filter
              title={item}
              isActive={team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>{players.length}</NumberOfPlayers>
      </HeaderList>

      <FlatList
        data={player}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <PlayerCard name={item} onRemove={() => {}} />
        )}
        ListEmptyComponent={() => (
          <ListEmpty message="Nao ha pessoas nesse time" />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          { paddingBottom: 100 },
          player.length === 0 && { flex: 1 },
        ]}
      />

      <Button title="Remover turma" type="SECONDARY" />
    </Container>
  );
}
