import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WorkloadService, WorkloadStats } from './workload.service';
import { CreateWorkloadDto } from './dto/create-workload.dto';
import { Workload, WorkloadStatus } from './entities/workload.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';

@Controller('workload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class WorkloadController {
  constructor(private readonly workloadService: WorkloadService) {}

  @Post()
  // @Roles('คณบดี', 'รองคณบดีฝ่ายวิชาการ', 'รองคณบดีฝ่ายวิจัยและนวัตกรรม', 'รองคณบดีฝ่ายคุณภาพนิสิต')
  create(@Body() createWorkloadDto: CreateWorkloadDto): Promise<Workload> {
    return this.workloadService.create(createWorkloadDto);
  }

  @Get()
  findAll(): Promise<Workload[]> {
    return this.workloadService.findAll();
  }

  @Get('department/:department')
  findByDepartment(
    @Param('department') department: string,
  ): Promise<Workload[]> {
    return this.workloadService.findByDepartment(department);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: number): Promise<Workload[]> {
    return this.workloadService.findByUser(userId);
  }

  @Get('stats/department')
  // @Roles('คณบดี', 'รองคณบดีฝ่ายวิชาการ', 'รองคณบดีฝ่ายวิจัยและนวัตกรรม', 'รองคณบดีฝ่ายคุณภาพนิสิต')
  getWorkloadStatsByDepartment(): Promise<WorkloadStats[]> {
    return this.workloadService.getWorkloadStatsByDepartment();
  }

  @Get('stats/user/:userId')
  getWorkloadStatsByUser(
    @Param('userId') userId: number,
  ): Promise<WorkloadStats> {
    return this.workloadService.getWorkloadStatsByUser(userId);
  }

  @Get('search')
  searchByName(@Query('name') name: string): Promise<Workload[]> {
    return this.workloadService.searchByName(name);
  }

  @Put(':id/status')
  updateStatus(
    @Param('id') id: number,
    @Body('status') status: WorkloadStatus,
  ): Promise<Workload> {
    return this.workloadService.updateStatus(id, status);
  }

  @Delete(':id')
  // @Roles('คณบดี', 'รองคณบดีฝ่ายวิชาการ', 'รองคณบดีฝ่ายวิจัยและนวัตกรรม', 'รองคณบดีฝ่ายคุณภาพนิสิต')
  remove(@Param('id') id: number): Promise<void> {
    return this.workloadService.remove(id);
  }
}
