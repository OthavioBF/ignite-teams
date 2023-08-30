import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Button } from "../../components/Button";
import { GroupCard } from "../../components/GroupCard";
import { Header } from "../../components/Header";
import { HighLight } from "../../components/HighLight";
import { ListEmpty } from "../../components/ListEmpty";
import { groupGetAll } from "../../storage/group/groupGetAll";
import { Container } from "./styles";

export function Groups() {
  const [groups, setGroups] = useState<string[]>([]);

  const { navigate } = useNavigation();

  async function fetchGroups() {
    const data = await groupGetAll();
    setGroups(data);
  }

  function handleOpenGroups(group: string) {
    navigate("Players", { group });
  }

  useEffect(() => {
    fetchGroups();
  }, [groups]);

  return (
    <Container>
      <Header />

      <HighLight title="Turmas" subtitle="Jogue com sua turma" />

      <FlatList
        data={groups}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <GroupCard title={item} onPress={() => handleOpenGroups(item)} />
        )}
        contentContainerStyle={groups.length === 0 && { flex: 1 }}
        ListEmptyComponent={() => (
          <ListEmpty message="Que tal cadastrar a primeira turma?" />
        )}
      />

      <Button title="Criar nova turma" onPress={() => navigate("NewGroup")} />
    </Container>
  );
}
